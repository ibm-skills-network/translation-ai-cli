import {existsSync, mkdirSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

import {saveProfile} from '../../src/lib/profile/storage.js'

let originalHomeDir: string | undefined
let testDir: string | undefined

export function setupTestProfile(profileName = 'test-profile', responses: string[] = ['Hóla']) {
  originalHomeDir = process.env.HOME
  testDir = join(tmpdir(), `test-markdown-${Date.now()}`)
  mkdirSync(testDir, {recursive: true})
  process.env.HOME = testDir

  saveProfile({
    config: {
      responses,
    },
    name: profileName,
    provider: 'fake',
  })
}

export function teardownTestProfile() {
  if (originalHomeDir !== undefined) {
    process.env.HOME = originalHomeDir
  }

  if (testDir && existsSync(testDir)) {
    rmSync(testDir, {force: true, recursive: true})
  }
}
