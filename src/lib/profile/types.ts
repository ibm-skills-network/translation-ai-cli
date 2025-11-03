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

export interface FakeProfileConfig {
  responses: string[]
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

export interface FakeProfile {
  config: FakeProfileConfig
  name: string
  provider: 'fake'
}

export type Profile = FakeProfile | OpenAIProfile | WatsonxProfile
