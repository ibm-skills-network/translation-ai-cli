import {describe, expect, it} from '@jest/globals'
import {FakeListChatModel} from '@langchain/core/utils/testing'

import {MarkdownTranslator} from '../../../src/core/translators/markdown.js'

describe('MarkdownTranslator', () => {
  let fakeChatModel: FakeListChatModel
  let translator: MarkdownTranslator

  describe('translate', () => {
    it('translates markdown content and returns string', async () => {
      fakeChatModel = new FakeListChatModel({
        responses: ['Traducido'],
      })
      translator = new MarkdownTranslator(fakeChatModel)

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
      translator = new MarkdownTranslator(fakeChatModel)

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
