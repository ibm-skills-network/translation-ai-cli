import {ChatOpenAI} from '@langchain/openai'

export interface OpenAIConfig {
  apiKey: string
  maxTokens?: number
  model: string
  temperature?: number
}

export function createClient(config: OpenAIConfig): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: config.apiKey,
    maxRetries: 3,
    maxTokens: config.maxTokens || 2000,
    model: config.model,
    temperature: config.temperature || 0.3,
  })
}
