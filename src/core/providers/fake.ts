import {FakeListChatModel} from '@langchain/core/utils/testing'

export interface FakeConfig {
  responses: string[]
}

export function createClient(config: FakeConfig): FakeListChatModel {
  return new FakeListChatModel({
    responses: config.responses,
  })
}
