import { includeIgnoreFile } from '@eslint/compat'
import oclif from 'eslint-config-oclif'
import prettier from 'eslint-config-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),
  ...oclif,
  prettier,
  {
    files: ['test/**/*.test.ts'],
    rules: {
      // Allow 'any' type in test files for mocking flexibility
      '@typescript-eslint/no-explicit-any': 'off',
      // Disable Mocha rules since we use Jest
      'mocha/max-top-level-suites': 'off',
      'mocha/no-setup-in-describe': 'off',
    },
  },
]
