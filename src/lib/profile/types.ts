export interface OpenAIProfileConfig {
  apiKey: string
  model: string
}

export interface WatsonxProfileConfig {
  apiKey: string
  model: string
  projectId: string
  serviceUrl: string
}

export interface OpenAIProfile {
  config: OpenAIProfileConfig
  name: string
  provider: 'openai'
}

export interface WatsonxProfile {
  config: WatsonxProfileConfig
  name: string
  provider: 'watsonx'
}

export type Profile = OpenAIProfile | WatsonxProfile
