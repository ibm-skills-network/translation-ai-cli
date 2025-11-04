import {afterAll, beforeAll, describe, expect, it} from '@jest/globals'
import {runCommand} from '@oclif/test'

import {setupTestProfile, teardownTestProfile} from '../../helpers/profile-setup.js'

describe('translate:markdown command', () => {
  beforeAll(() => {
    setupTestProfile()
  })

  afterAll(() => {
    teardownTestProfile()
  })

  describe('basic usage', () => {
    it('translates markdown', async () => {
      await expect(
        runCommand(['translate:markdown', '--profile', 'test-profile', '--from', 'EN', '--to', 'ES', 'Hello']),
      ).resolves.not.toThrow()
    })

    it('streams translated markdown', async () => {
      await expect(
        runCommand(['translate:markdown', '--profile', 'test-profile', '--from', 'EN', '--to', 'ES', '--stream', 'Hello']),
      ).resolves.not.toThrow()
    })
  })

  describe('output verification', () => {
    it('outputs the correct translation', async () => {
      setupTestProfile('test-profile', ['Hóla'])

      const {stdout} = await runCommand([
        'translate:markdown',
        '--profile',
        'test-profile',
        '--from',
        'EN',
        '--to',
        'ES',
        'Hello',
      ])
      expect(stdout).toBe('Hóla')
    })

    it('streams the correct translation', async () => {
      setupTestProfile('test-profile', ['Hóla'])

      const {stdout} = await runCommand([
        'translate:markdown',
        '--profile',
        'test-profile',
        '--from',
        'EN',
        '--to',
        'ES',
        '--stream',
        'Hello',
      ])
      expect(stdout).toBe('Hóla')
    })

    it('respects splitting rules', async () => {
      setupTestProfile('test-profile', ['# Page 1\nbonjour', '# Page 2\nmonde'])

      const {stdout} = await runCommand([
        'translate:markdown',
        '--profile',
        'test-profile',
        '--from',
        'EN',
        '--to',
        'FR',
        '"# Page 1\nhello\n# Page 2\nworld"',
      ])
      expect(stdout).toBe('# Page 1\nbonjour\n# Page 2\nmonde')
    })
  })
})
