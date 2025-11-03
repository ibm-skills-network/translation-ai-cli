import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {join} from 'node:path'

import type {Profile} from './types.js'

export function getProfilesDir(): string {
  const home = process.env.HOME || homedir()
  return join(home, '.config', 'translation-ai-cli', 'profiles')
}

export function ensureProfilesDir(): void {
  const dir = getProfilesDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true})
  }
}

export function getProfilePath(name: string): string {
  // Reject path traversal attempts, empty names, or names with path separators
  if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) {
    throw new Error(`Invalid profile name: "${name}". Profile names cannot contain path separators or parent directory references.`)
  }

  return join(getProfilesDir(), `${name}.json`)
}

export function saveProfile(profile: Profile): void {
  ensureProfilesDir()
  const path = getProfilePath(profile.name)
  writeFileSync(path, JSON.stringify(profile, null, 2), {
    encoding: 'utf8',
    mode: 0o600, // only owner can read/write
  })
}

export function loadProfile(name: string): Profile {
  const path = getProfilePath(name)
  if (!existsSync(path)) {
    throw new Error(`Profile "${name}" does not exist`)
  }

  const content = readFileSync(path, 'utf8')
  return JSON.parse(content) as Profile
}

export function listProfiles(): string[] {
  const dir = getProfilesDir()
  if (!existsSync(dir)) {
    return []
  }

  return readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
}

export function deleteProfile(name: string): void {
  const path = getProfilePath(name)
  if (!existsSync(path)) {
    throw new Error(`Profile "${name}" does not exist`)
  }

  rmSync(path)
}

export function profileExists(name: string): boolean {
  return existsSync(getProfilePath(name))
}
