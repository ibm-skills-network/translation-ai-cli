import {describe, expect, it} from '@jest/globals'
import {FakeListChatModel} from '@langchain/core/utils/testing'

import {MARKDOWN_SYSTEM_PROMPT} from '../../../src/core/prompts/markdown.js'
import {MarkdownSplitter} from '../../../src/core/splitters/markdown.js'
import {Translator} from '../../../src/core/translators/translator.js'

describe('MarkdownTranslator', () => {
  let fakeChatModel: FakeListChatModel
  let translator: Translator

  describe('translate', () => {
    it('translates markdown content and returns string', async () => {
      fakeChatModel = new FakeListChatModel({
        responses: ['Traducido'],
      })
      translator = new Translator(fakeChatModel, new MarkdownSplitter(), MARKDOWN_SYSTEM_PROMPT)

      const result = await translator.translate({
        content: '# Hello World',
        sourceLanguage: 'EN',
        targetLanguage: 'ES',
      })

      expect(result).toBe('Traducido')
    })
  })

  describe('translateStream', () => {
    it('yields translated chunks from stream', async () => {
      fakeChatModel = new FakeListChatModel({
        responses: ['Hello World'],
      })
      translator = new Translator(fakeChatModel, new MarkdownSplitter(), MARKDOWN_SYSTEM_PROMPT)

      const chunks: string[] = []
      for await (const chunk of translator.translateStream({
        content: '# Test',
        sourceLanguage: 'EN',
        targetLanguage: 'ES',
      })) {
        chunks.push(chunk)
      }

      expect(chunks.join('')).toBe('Hello World')
    })
  })
})
