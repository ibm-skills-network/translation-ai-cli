import {includeIgnoreFile} from '@eslint/compat'
import vitest from '@vitest/eslint-plugin'
import oclif from 'eslint-config-oclif'
import prettier from 'eslint-config-prettier'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),
  ...oclif,
  prettier,
  {
    files: ['test/**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      // Disable Mocha rules since we use Vitest
      'mocha/max-top-level-suites': 'off',
      'mocha/no-setup-in-describe': 'off',
    },
  },
]
