import {ChatWatsonx} from '@langchain/community/chat_models/ibm'

export interface WatsonxConfig {
  apiKey: string
  maxNewTokens?: number
  model: string
  projectId: string
  serviceUrl: string
  temperature?: number
}

export function createClient(config: WatsonxConfig): ChatWatsonx {
  return new ChatWatsonx({
    maxRetries: 3,
    maxTokens: config.maxNewTokens || 2000,
    model: config.model,
    projectId: config.projectId,
    serviceUrl: config.serviceUrl,
    temperature: config.temperature || 0.3,
    version: '2024-05-31',
    watsonxAIApikey: config.apiKey,
    watsonxAIAuthType: 'iam',
  })
}
