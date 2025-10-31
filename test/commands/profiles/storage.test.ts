import {afterEach, beforeEach, describe, expect, it} from '@jest/globals'
import {existsSync, mkdirSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

import type {Profile} from '../../../src/lib/profile/types.js'

import {
  deleteProfile,
  getProfilePath,
  listProfiles,
  loadProfile,
  profileExists,
  saveProfile,
} from '../../../src/lib/profile/storage.js'

describe('profile storage', () => {
  let testDir: string
  const originalHomeDir = process.env.HOME

  beforeEach(() => {
    testDir = join(tmpdir(), `test-profiles-${Date.now()}`)
    mkdirSync(testDir, {recursive: true})
    process.env.HOME = testDir
  })

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, {force: true, recursive: true})
    }

    process.env.HOME = originalHomeDir
  })

  describe('saveProfile', () => {
    it('creates profiles directory if it does not exist', () => {
      const profilesDir = join(testDir, '.config', 'translation-ai-cli', 'profiles')
      if (existsSync(profilesDir)) {
        rmSync(profilesDir, {force: true, recursive: true})
      }

      const profile: Profile = {
        config: {
          apiKey: 'test-key',
          model: 'gpt-4o',
        },
        name: 'test-profile',
        provider: 'openai',
      }

      saveProfile(profile)

      expect(existsSync(profilesDir)).toBe(true)
      expect(existsSync(getProfilePath('test-profile'))).toBe(true)
    })

    it('saves an OpenAI profile', () => {
      const profile: Profile = {
        config: {
          apiKey: 'test-key',
          model: 'gpt-4o',
        },
        name: 'test-openai',
        provider: 'openai',
      }

      saveProfile(profile)

      const saved = loadProfile('test-openai')
      expect(saved).toEqual(profile)
    })

    it('saves a Watsonx profile', () => {
      const profile: Profile = {
        config: {
          apiKey: 'test-key',
          model: 'ibm/granite-4-h-small',
          projectId: 'test-project',
          serviceUrl: 'https://test.example.com',
        },
        name: 'test-watsonx',
        provider: 'watsonx',
      }

      saveProfile(profile)

      const saved = loadProfile('test-watsonx')
      expect(saved).toEqual(profile)
    })

    it('overwrites existing profile (idempotent)', () => {
      const profile1: Profile = {
        config: {
          apiKey: 'key-1',
          model: 'gpt-4o',
        },
        name: 'test-profile',
        provider: 'openai',
      }

      const profile2: Profile = {
        config: {
          apiKey: 'key-2',
          model: 'gpt-4o-mini',
        },
        name: 'test-profile',
        provider: 'openai',
      }

      saveProfile(profile1)
      saveProfile(profile2)

      const saved = loadProfile('test-profile')
      expect(saved).toEqual(profile2)
    })
  })

  describe('loadProfile', () => {
    it('loads an existing profile', () => {
      const profile: Profile = {
        config: {
          apiKey: 'test-key',
          model: 'gpt-4o',
        },
        name: 'test-profile',
        provider: 'openai',
      }

      saveProfile(profile)

      const loaded = loadProfile('test-profile')
      expect(loaded).toEqual(profile)
    })

    it('throws error when profile does not exist', () => {
      expect(() => loadProfile('nonexistent')).toThrow('Profile "nonexistent" does not exist')
    })
  })

  describe('listProfiles', () => {
    it('returns empty array when no profiles exist', () => {
      const profiles = listProfiles()
      expect(profiles).toEqual([])
    })

    it('returns empty array when directory does not exist', () => {
      rmSync(testDir, {force: true, recursive: true})
      const profiles = listProfiles()
      expect(profiles).toEqual([])
    })

    it('lists all saved profiles', () => {
      const profile1: Profile = {
        config: {
          apiKey: 'key-1',
          model: 'gpt-4o',
        },
        name: 'profile-1',
        provider: 'openai',
      }

      const profile2: Profile = {
        config: {
          apiKey: 'key-2',
          model: 'ibm/granite-4-h-small',
          projectId: 'test-project',
          serviceUrl: 'https://test.example.com',
        },
        name: 'profile-2',
        provider: 'watsonx',
      }

      saveProfile(profile1)
      saveProfile(profile2)

      const profiles = listProfiles()
      expect(profiles).toContain('profile-1')
      expect(profiles).toContain('profile-2')
      expect(profiles).toHaveLength(2)
    })
  })

  describe('deleteProfile', () => {
    it('deletes an existing profile', () => {
      const profile: Profile = {
        config: {
          apiKey: 'test-key',
          model: 'gpt-4o',
        },
        name: 'test-profile',
        provider: 'openai',
      }

      saveProfile(profile)
      expect(profileExists('test-profile')).toBe(true)

      deleteProfile('test-profile')
      expect(profileExists('test-profile')).toBe(false)
    })

    it('throws error when profile does not exist', () => {
      expect(() => deleteProfile('nonexistent')).toThrow('Profile "nonexistent" does not exist')
    })
  })

  describe('profileExists', () => {
    it('returns true when profile exists', () => {
      const profile: Profile = {
        config: {
          apiKey: 'test-key',
          model: 'gpt-4o',
        },
        name: 'test-profile',
        provider: 'openai',
      }

      saveProfile(profile)
      expect(profileExists('test-profile')).toBe(true)
    })

    it('returns false when profile does not exist', () => {
      expect(profileExists('nonexistent')).toBe(false)
    })
  })
})
