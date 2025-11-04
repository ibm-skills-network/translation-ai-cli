import type {BaseChatModel} from '@langchain/core/language_models/chat_models'

import {BaseMessage, HumanMessage, SystemMessage} from '@langchain/core/messages'

import type {BaseSplitter, TranslationOptions} from '../types.js'

/**
 * Generic translator that orchestrates content splitting, translation, and reconstruction.
 * Works with any splitter and prompt via dependency injection.
 */
export class Translator {
  constructor(
    private chatModel: BaseChatModel,
    private splitter: BaseSplitter,
    private systemPromptTemplate: string,
  ) {}

  /**
   * Translates content from source language to target language
   */
  async translate(options: TranslationOptions): Promise<string> {
    const chunks = await this.splitter.split(options.content)
    let response = ''

    for (const chunk of chunks) {
      if (chunk.shouldTranslate) {
        // eslint-disable-next-line no-await-in-loop
        const translatedChunk = await this.chatModel.invoke(this.buildMessages({...options, content: chunk.content}))

        response = this.splitter.reconstruct(response, {...chunk, content: translatedChunk.content as string})
      } else {
        response = this.splitter.reconstruct(response, chunk)
      }
    }

    return response
  }

  /**
   * Streams translated content from source language to target language
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
    const systemPrompt = this.interpolatePrompt(this.systemPromptTemplate, sourceLanguage, targetLanguage)
    const messages = [new SystemMessage(systemPrompt), new HumanMessage(content)]

    return messages
  }

  private interpolatePrompt(template: string, sourceLanguage: string, targetLanguage: string): string {
    return template.replaceAll('{{sourceLanguage}}', sourceLanguage).replaceAll('{{targetLanguage}}', targetLanguage)
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
