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
})
