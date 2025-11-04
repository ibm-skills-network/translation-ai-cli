import type {BaseChatModel} from '@langchain/core/language_models/chat_models'

import {BaseMessage, HumanMessage, SystemMessage} from '@langchain/core/messages'

import type {TranslationOptions} from '../types.js'

import {MarkdownSplitter} from '../splitters/markdown.js'

/**
 * Translates markdown content using a chat model
 */
export class MarkdownTranslator {
  private splitter: MarkdownSplitter

  constructor(private chatModel: BaseChatModel) {
    this.splitter = new MarkdownSplitter()
  }

  /**
   * Translates markdown content from source language to target language
   */
  async translate(options: TranslationOptions): Promise<string> {
    const chunks = await this.splitter.split(options.content)
    let response = ''

    for (const chunk of chunks) {
      if (chunk.shouldTranslate) {
        // eslint-disable-next-line no-await-in-loop
        const translatedChunk = await this.chatModel.invoke(this.buildMessages({...options, content: chunk.content}))

        response = this.splitter.reconstructChunk(response, {...chunk, content: translatedChunk.content as string})
      } else {
        response = this.splitter.reconstructChunk(response, chunk)
      }
    }

    return response
  }

  /**
   * Streams translated markdown content from source language to target language
   * @yields {string} Chunks of translated content
   */
  async *translateStream(options: TranslationOptions): AsyncGenerator<string> {
    const chunks = await this.splitter.split(options.content)

    for (const chunk of chunks) {
      yield chunk.leadingWhitespace || ''

      if (chunk.shouldTranslate) {
        // eslint-disable-next-line no-await-in-loop
        for await (const streamedChunk of this.streamChunk({
          ...options,
          content: chunk.content,
        })) {
          yield streamedChunk
        }
      } else {
        yield chunk.content
      }

      yield chunk.trailingWhitespace || ''
    }
  }

  private buildMessages({content, sourceLanguage, targetLanguage}: TranslationOptions): BaseMessage[] {
    const systemPrompt = this.createSystemPrompt(sourceLanguage, targetLanguage)
    const messages = [new SystemMessage(systemPrompt), new HumanMessage(content)]

    return messages
  }

  /**
   * Creates the system prompt for translation
   */
  private createSystemPrompt(sourceLanguage: string, targetLanguage: string): string {
    return `
You are a helpful assistant that accurately translates markdown document snippets from ${sourceLanguage} to ${targetLanguage} while preserving markdown syntax, formatting, and custom directives.
You always preserve the structure and formatting exactly as it is.
You do not add, alter or modify the text you receive in any way.

Reminder:
- Translate only the text, preserving the structure and formatting.
- NEVER under any circumstances translate any words found inside backticks Eg. \`Text\`.
- NEVER translate custom directive like ::startApplication{...} or ::openFile{...}.
- DO translate titles inside the ::page{title=""} custom directive.
- NEVER translate keywords that appear after colons, such as \`:fa-lightbulb-o:\`.
- NEVER translate the sections "Author", "Other Contributors", and "Change Logs".
- NEVER translate any URLs.
- NEVER translate HTML tags like \`<details>\` and \`<summary>\`.
- Translate idiomatically, adapting expressions to sound natural in ${targetLanguage}.
- Avoid overly literal translations; prioritize clarity and fluency in ${targetLanguage} over word-for-word accuracy.
- Use concise and clear language that would sound natural in everyday speech or written ${targetLanguage}.
- When technical ${sourceLanguage} terms lack a common ${targetLanguage} equivalent, use well-known ${targetLanguage} alternatives or rephrase for clarity.
- Be consistent with technical terms. If an equivalent technical term is not available in ${targetLanguage}, always use the original term.

*IMPORTANT*
Translate without any additional information or comments.
`
  }

  /**
   * Streams a single chunk through the chat model
   * @yields {string} Chunks of translated content from the model
   */
  private async *streamChunk(options: TranslationOptions): AsyncGenerator<string> {
    const stream = await this.chatModel.stream(this.buildMessages(options))

    for await (const chunk of stream) {
      const {content} = chunk
      if (typeof content === 'string') {
        yield content
      }
    }
  }
}
