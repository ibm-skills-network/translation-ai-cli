import { ChatWatsonx } from '@langchain/community/chat_models/ibm';

/**
 * Configuration for watsonx.ai client
 */
export interface WatsonxConfig {
  serviceUrl: string;
  projectId: string;
  apiKey: string;
  model?: string;
  maxNewTokens?: number;
  temperature?: number;
}

/**
 * Creates and returns a configured watsonx.ai chat model with IAM authentication
 */
export function createWatsonxClient(config?: Partial<WatsonxConfig>): ChatWatsonx {
  // Get configuration from environment variables or provided config
  const serviceUrl = config?.serviceUrl || process.env.WATSONX_AI_SERVICE_URL;
  const projectId = config?.projectId || process.env.WATSONX_AI_PROJECT_ID;
  const apiKey = config?.apiKey || process.env.WATSONX_AI_APIKEY;

  // Validate required configuration
  if (!serviceUrl) {
    throw new Error('WATSONX_AI_SERVICE_URL is required');
  }

  if (!projectId) {
    throw new Error('WATSONX_AI_PROJECT_ID is required');
  }

  if (!apiKey) {
    throw new Error('WATSONX_AI_APIKEY is required');
  }

  // Create and return the chat model with IAM authentication
  return new ChatWatsonx({
    model: config?.model || 'ibm/granite-3-8b-instruct',
    version: '2024-05-31',
    serviceUrl,
    projectId,
    watsonxAIAuthType: 'iam',
    watsonxAIApikey: apiKey,
    maxTokens: config?.maxNewTokens || 2000,
    temperature: config?.temperature || 0.3,
    maxRetries: 3,
  });
}
