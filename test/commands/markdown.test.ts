import {describe, expect, it, jest} from '@jest/globals'
import {runCommand} from '@oclif/test'

jest.unstable_mockModule('../../src/core/providers/watsonx.js', () => ({
  createClient: jest.fn(() => ({
    invoke: jest.fn(async () => ({
      content: 'Hóla',
    })),
    stream: jest.fn(async function* () {
      yield {content: 'Hól'}
      yield {content: 'a'}
    }),
  })),
}))

describe('command structure', () => {
  it('accepts --from and --to flags with input', async () => {
    try {
      await runCommand(['markdown', '--from', 'EN', '--to', 'ES', 'Hello'])
    } catch (error: unknown) {
      expect((error as Error).message).not.toMatch(/Unknown flag|Unexpected argument/i)
    }
  })

  it('accepts --stream flag', async () => {
    try {
      await runCommand(['markdown', '--from', 'EN', '--to', 'ES', '--stream', 'Hello'])
    } catch (error: unknown) {
      expect((error as Error).message).not.toMatch(/Unknown flag|Unexpected argument/i)
    }
  })
})

describe('run', () => {
  it('writes the translated text to stdout', async () => {
    const {stdout} = await runCommand(['markdown', '--from', 'EN', '--to', 'ES', 'Hello'])
    expect(stdout).toEqual('Hóla')
  })

  it('streams the translated text to stdout', async () => {
    const {stdout} = await runCommand(['markdown', '--from', 'EN', '--to', 'ES', '--stream', 'Hello'])
    expect(stdout).toEqual('Hóla')
  })
})
