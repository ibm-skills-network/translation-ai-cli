import {beforeEach, describe, expect, it} from '@jest/globals'

import {MarkdownSplitter} from '../../../src/core/splitters/markdown.js'

describe('MarkdownSplitter', () => {
  let splitter: MarkdownSplitter

  beforeEach(() => {
    splitter = new MarkdownSplitter()
  })

  describe('split', () => {
    it('correctly splits content by markdown headers', async () => {
      const markdown = `# Header 1
Content 1
## Header 2
Content 2
`

      const chunks = await splitter.split(markdown)

      expect(chunks.length).toBe(2)
    })

    it('marks frontmatter as non-translatable', async () => {
      const markdown = `---
frontmatter: true
---
# Content
`

      const chunks = await splitter.split(markdown)
      const frontmatterChunk = chunks.find((chunk) => chunk.content.includes('---'))
      expect(frontmatterChunk?.shouldTranslate).toBe(false)
    })

    it('marks code blocks as non-translatable', async () => {
      const markdown = `# Header
\`\`\`ruby
def hello
  puts 'Hello, world!'
end
\`\`\`
`

      const chunks = await splitter.split(markdown)
      const codeBlockChunk = chunks.find((chunk) => chunk.content.includes('def hello'))
      expect(codeBlockChunk?.shouldTranslate).toBe(false)
    })

    it('correctly parses codeblocks with trailing whitespace', async () => {
      const markdown = `# Header
\`\`\`ruby
def hello
  puts 'Hello, world!'
end
\`\`\`
`

      const chunks = await splitter.split(markdown)
      const codeBlockChunk = chunks.find((chunk) => chunk.content.includes('def hello'))
      expect(codeBlockChunk?.shouldTranslate).toBe(false)
      expect(chunks.length).toBe(2)
    })

    it('correctly parses codeblocks with dashes', async () => {
      const markdown = `# Header
\`\`\`sh-session
def hello
  puts 'Hello, world!'
end
\`\`\`
`

      const chunks = await splitter.split(markdown)
      const codeBlockChunk = chunks.find((chunk) => chunk.content.includes('def hello'))
      expect(codeBlockChunk?.shouldTranslate).toBe(false)
      expect(chunks.length).toBe(2)
    })

    it('marks regular text as translatable', async () => {
      const markdown = `# Header
This is translatable text.
`

      const chunks = await splitter.split(markdown)
      const textChunk = chunks.find((chunk) => chunk.content.includes('This is translatable text'))
      expect(textChunk?.shouldTranslate).toBe(true)
    })

    it('splits content by custom directive ::page', async () => {
      const markdown = `::page={title="Page 1"}
# Content 1
body
::page={title="Page 2"}
Content 2
`

      const chunks = await splitter.split(markdown)
      expect(chunks.length).toBe(2)
    })

    it('marks code blocks as non-translatable', async () => {
      const markdown = `::page={title="Page 1"}
\`\`\`python
print("Hello, world!")
\`\`\`
`

      const chunks = await splitter.split(markdown)
      const codeBlockChunk = chunks.find((chunk) => chunk.content.includes('print("Hello, world!")'))
      expect(codeBlockChunk?.shouldTranslate).toBe(false)
    })

    it('marks regular text as translatable', async () => {
      const markdown = `::page={title="Page 1"}
This is translatable text.
`

      const chunks = await splitter.split(markdown)
      const textChunk = chunks.find((chunk) => chunk.content.includes('This is translatable text'))
      expect(textChunk?.shouldTranslate).toBe(true)
    })
  })

  describe('whitespace preservation', () => {
    it('preserves trailing newlines on chunks', async () => {
      const markdown = `# Header 1
Content 1

## Header 2
Content 2
`

      const chunks = await splitter.split(markdown)

      // First chunk should have trailing double newline
      expect(chunks[0].trailingWhitespace).toBe('\n\n')

      // Second chunk should have trailing single newline
      expect(chunks[1].trailingWhitespace).toBe('\n')
    })

    it('preserves leading whitespace on chunks', async () => {
      const markdown = `

# Header with leading blank lines
Content
`

      const chunks = await splitter.split(markdown)

      // First chunk should have leading double newline
      expect(chunks[0].leadingWhitespace).toBe('\n\n')
    })

    it('preserves whitespace before code blocks', async () => {
      const markdown = `Some text before code.

\`\`\`ruby
code here
\`\`\`
`

      const chunks = await splitter.split(markdown)
      const textChunk = chunks.find((chunk) => chunk.content.includes('Some text before code'))
      const codeChunk = chunks.find((chunk) => chunk.content.includes('code here'))

      // Text chunk should have trailing double newline
      expect(textChunk?.trailingWhitespace).toBe('\n\n')

      // Code block should start clean (LangChain will handle its own whitespace)
      expect(codeChunk?.shouldTranslate).toBe(false)
    })

    it('preserves whitespace before ::page directives', async () => {
      const markdown = `Content for page 1.

::page={title="Page 2"}
Content for page 2.
`

      const chunks = await splitter.split(markdown)

      // First chunk should have trailing double newline
      expect(chunks[0].trailingWhitespace).toBe('\n\n')

      // Second chunk (::page) should have no leading whitespace (it was trailing on prev chunk)
      expect(chunks[1].leadingWhitespace).toBe('')
    })

    it('trims content while preserving whitespace metadata', async () => {
      const markdown = `
# Header with weird spacing

Content
`

      const chunks = await splitter.split(markdown)

      // Content should be trimmed
      expect(chunks[0].content).not.toMatch(/^\s/)
      expect(chunks[0].content).not.toMatch(/\s$/)

      // But whitespace should be preserved in metadata
      expect(chunks[0].leadingWhitespace).toBeTruthy()
      expect(chunks[0].trailingWhitespace).toBeTruthy()
    })

    it('handles chunks with no leading/trailing whitespace', async () => {
      const markdown = `# Header
Content`

      const chunks = await splitter.split(markdown)

      // Should have chunks without errors
      expect(chunks.length).toBeGreaterThan(0)

      // Trailing whitespace should be empty string or undefined
      expect(chunks.at(-1)?.trailingWhitespace || '').toBe('')
    })

    it('preserves exact whitespace in complex documents', async () => {
      const markdown = `---
title: Test
---

# Header 1

Paragraph 1.

## Header 2

\`\`\`js
code();
\`\`\`

Final paragraph.
`

      const chunks = await splitter.split(markdown)

      // Reconstruct the document from chunks
      let reconstructed = ''

      for (const chunk of chunks) {
        reconstructed += chunk.leadingWhitespace || ''
        reconstructed += chunk.content
        reconstructed += chunk.trailingWhitespace || ''
      }

      // Reconstructed should match original
      expect(reconstructed).toBe(markdown)
    })
  })
})
