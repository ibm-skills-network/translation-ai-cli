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

    // Initialize LangChain's MarkdownTextSplitter for Pass 2
    this.recursiveSplitter = new MarkdownTextSplitter({
      chunkOverlap: 0, // No overlap needed for translation (avoids duplicates)
      chunkSize,
      keepSeparator: true, // Preserve markdown formatting (headers, etc.)
    })
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

    // Process all chunks, splitting large ones
    const splitPromises = chunks.map(async (chunk) => {
      // If chunk is within size limit, keep as-is
      if (chunk.content.length <= this.chunkSize) {
        return [chunk]
      }

      // Chunk is too large - use LangChain's recursive splitter
      const splitTexts = await this.recursiveSplitter.splitText(chunk.content)

      // Preserve the shouldTranslate flag on all sub-chunks
      return splitTexts.map((text) => ({
        content: text,
        shouldTranslate: chunk.shouldTranslate,
      }))
    })

    const splitResults = await Promise.all(splitPromises)

    // Flatten the results
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
    const lines = markdown.split('\n').map((line) => line + '\n')
    let currentPosition = 0

    // Handle frontmatter if present
    if (this.hasFrontmatter(lines)) {
      const endIndex = this.findFrontmatterEnd(lines)
      const frontmatterContent = lines.slice(0, endIndex + 1).join('')
      chunks.push({
        content: frontmatterContent,
        shouldTranslate: false,
      })
      currentPosition = endIndex + 1
    }

    let currentChunk: Chunk = {content: '', shouldTranslate: true}
    let inCodeBlock = false

    for (let i = currentPosition; i < lines.length; i++) {
      const line = lines[i]

      // Check for code fence (supports language identifiers and trailing whitespace)
      // Matches: ```, ```ruby, ```sh-session, ```python  , etc.
      if (/^```[\w-]*\s*$/.test(line)) {
        if (inCodeBlock) {
          // End of code block
          currentChunk.content += line
          chunks.push(currentChunk)
          currentChunk = {content: '', shouldTranslate: true}
          inCodeBlock = false
        } else {
          // Start of code block
          if (currentChunk.content.trim()) {
            chunks.push(currentChunk)
          }

          currentChunk = {content: line, shouldTranslate: false}
          inCodeBlock = true
        }

        continue
      }

      // Handle line based on current state and patterns
      if (splitPattern.test(line) && !inCodeBlock) {
        // This line matches the split pattern and we're not in a code block
        if (currentChunk.content.trim()) {
          chunks.push(currentChunk)
        }

        currentChunk = {content: line, shouldTranslate: true}
      } else {
        // Regular line - append to current chunk
        currentChunk.content += line
      }
    }

    // Add final chunk if not empty
    if (currentChunk.content.trim()) {
      chunks.push(currentChunk)
    }

    // Filter out empty chunks
    return chunks.filter((chunk) => chunk.content.trim() !== '')
  }
}
