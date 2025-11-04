import {MarkdownTextSplitter} from '@langchain/textsplitters'

import type {Chunk} from '../types.js'

/**
 * Hybrid two-pass markdown splitter for translation purposes.
 *
 * Pass 1: Structural split by markdown elements (frontmatter, code blocks, headers/page directives)
 * Pass 2: Size-based recursive split using LangChain for chunks exceeding chunkSize
 *
 * This approach:
 * - Respects markdown structure and translation requirements (code blocks, frontmatter = non-translatable)
 * - Prevents massive chunks from overwhelming translation APIs
 * - Uses LangChain's intelligent splitting for size management (tries headers > paragraphs > lines)
 */
export class MarkdownSplitter {
  private readonly chunkSize: number
  private recursiveSplitter: MarkdownTextSplitter

  constructor(chunkSize = 12_000) {
    this.chunkSize = chunkSize

    this.recursiveSplitter = new MarkdownTextSplitter({
      chunkOverlap: 0,
      chunkSize,
      keepSeparator: true,
    })
  }

  /**
   * Appends a chunk to an accumulator string, preserving whitespace
   */
  reconstructChunk(accumulator: string, chunk: Chunk): string {
    return accumulator + (chunk.leadingWhitespace || '') + chunk.content + (chunk.trailingWhitespace || '')
  }

  /**
   * Default split method - automatically detects and uses the appropriate splitting strategy.
   * If the content contains ::page directives, splits by those.
   * Otherwise, splits by headers (# ## ### etc.)
   */
  async split(markdown: string): Promise<Chunk[]> {
    if (/^::page/m.test(markdown)) {
      return this.splitByPageDirective(markdown)
    }

    return this.splitByHeaders(markdown)
  }

  /**
   * Splits markdown by headers (# ## ### etc.)
   */
  async splitByHeaders(markdown: string): Promise<Chunk[]> {
    const firstPassChunks = this.splitInternal(markdown, /^#+\s+/m)

    return this.secondPassSplit(firstPassChunks)
  }

  /**
   * Splits markdown by custom ::page directives
   */
  async splitByPageDirective(markdown: string): Promise<Chunk[]> {
    const firstPassChunks = this.splitInternal(markdown, /^::page/m)

    return this.secondPassSplit(firstPassChunks)
  }

  /**
   * Creates a chunk with whitespace extracted and stored separately
   */
  private createChunk(content: string, shouldTranslate: boolean): Chunk {
    const leadingWhitespace = content.match(/^\s+/)?.[0] || ''
    const trailingWhitespace = content.match(/\s+$/)?.[0] || ''
    const trimmedContent = content.trim()

    return {
      content: trimmedContent,
      leadingWhitespace,
      shouldTranslate,
      trailingWhitespace,
    }
  }

  /**
   * Finds the index of the closing --- for frontmatter
   */
  private findFrontmatterEnd(lines: string[]): number {
    return lines.slice(1).findIndex((line) => line.trim() === '---') + 1
  }

  /**
   * Checks if the markdown starts with YAML frontmatter (--- ... ---)
   */
  private hasFrontmatter(lines: string[]): boolean {
    if (lines.length === 0) return false

    return lines[0].trim() === '---' && lines.slice(1).some((line) => line.trim() === '---')
  }

  /**
   * Pass 2: Size-based recursive split using LangChain
   *
   * For chunks exceeding chunkSize, uses MarkdownTextSplitter to break them down
   * intelligently while preserving the shouldTranslate flag.
   *
   * LangChain's MarkdownTextSplitter tries separators in this order:
   * 1. H2-H6 headers (## ### #### etc.)
   * 2. Code blocks with spacing
   * 3. Horizontal rules (---, ***, ___)
   * 4. Paragraph breaks (\n\n)
   * 5. Line breaks (\n)
   * 6. Spaces
   * 7. Characters (last resort)
   */
  private async secondPassSplit(chunks: Chunk[]): Promise<Chunk[]> {
    const finalChunks: Chunk[] = []

    const splitPromises = chunks.map(async (chunk) => {
      if (chunk.content.length <= this.chunkSize) {
        return [chunk]
      }

      const splitTexts = await this.recursiveSplitter.splitText(chunk.content)

      return splitTexts.map((text, textIndex) => {
        const isFirst = textIndex === 0
        const isLast = textIndex === splitTexts.length - 1

        return this.createChunk(
          (isFirst ? chunk.leadingWhitespace || '' : '') + text + (isLast ? chunk.trailingWhitespace || '' : ''),
          chunk.shouldTranslate,
        )
      })
    })

    const splitResults = await Promise.all(splitPromises)

    for (const result of splitResults) {
      finalChunks.push(...result)
    }

    return finalChunks
  }

  /**
   * Pass 1: Structural split using state machine (ported from Ruby implementation)
   *
   * Handles:
   * - Frontmatter detection (YAML between --- markers)
   * - Code block detection (``` fences)
   * - Split pattern matching (headers or ::page directives)
   * - shouldTranslate flag assignment
   */
  private splitInternal(markdown: string, splitPattern: RegExp): Chunk[] {
    const chunks: Chunk[] = []
    const splitLines = markdown.split('\n')

    const hasTrailingNewline = markdown.endsWith('\n')

    if (hasTrailingNewline && splitLines.at(-1) === '') {
      splitLines.pop()
    }

    const lines = splitLines.map((line) => line + '\n')

    if (!hasTrailingNewline && lines.length > 0) {
      lines[lines.length - 1] = lines.at(-1)!.slice(0, -1)
    }

    let currentPosition = 0

    if (this.hasFrontmatter(lines)) {
      const endIndex = this.findFrontmatterEnd(lines)
      const frontmatterContent = lines.slice(0, endIndex + 1).join('')
      chunks.push(this.createChunk(frontmatterContent, false))
      currentPosition = endIndex + 1
    }

    let currentChunkContent = ''
    let currentChunkShouldTranslate = true
    let inCodeBlock = false

    for (let i = currentPosition; i < lines.length; i++) {
      const line = lines[i]

      if (/^```[\w-]*\s*$/.test(line)) {
        if (inCodeBlock) {
          currentChunkContent += line
          chunks.push(this.createChunk(currentChunkContent, currentChunkShouldTranslate))
          currentChunkContent = ''
          currentChunkShouldTranslate = true
          inCodeBlock = false
        } else {
          if (currentChunkContent.trim()) {
            chunks.push(this.createChunk(currentChunkContent, currentChunkShouldTranslate))
            currentChunkContent = line
          } else {
            currentChunkContent += line
          }

          currentChunkShouldTranslate = false
          inCodeBlock = true
        }

        continue
      }

      if (splitPattern.test(line) && !inCodeBlock) {
        if (currentChunkContent.trim()) {
          chunks.push(this.createChunk(currentChunkContent, currentChunkShouldTranslate))
          currentChunkContent = line
        } else {
          currentChunkContent += line
        }

        currentChunkShouldTranslate = true
      } else {
        currentChunkContent += line
      }
    }

    if (currentChunkContent.trim()) {
      chunks.push(this.createChunk(currentChunkContent, currentChunkShouldTranslate))
    }

    return chunks.filter((chunk) => chunk.content !== '')
  }
}
