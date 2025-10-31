import type {BaseChatModel} from '@langchain/core/language_models/chat_models'

import type {Profile} from './types.js'

import {createClient as createOpenAIClient} from '../../core/providers/openai.js'
import {createClient as createWatsonxClient} from '../../core/providers/watsonx.js'

export function createProviderFromProfile(profile: Profile): BaseChatModel {
  switch (profile.provider) {
    case 'openai': {
      return createOpenAIClient(profile.config)
    }

    case 'watsonx': {
      return createWatsonxClient(profile.config)
    }
  }
}
