import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [{
  ignores: [
    '**/.eslintrc.cjs',
    '**/database/**/*.js',
    '**/database/**/*.ts',
    '**/*.cjs',
    '**/node_modules/',
    '**/dist/',
    '**/prepare_template.js',
    '**/out/*',
    '**/*.d.ts'
  ]
}, ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'), {
  plugins: {
    '@typescript-eslint': typescriptEslint
  },

  languageOptions: {
    parser: tsParser,
    ecmaVersion: 5,
    sourceType: 'script',

    parserOptions: {
      parser: '@typescript-eslint/parser',
      project: './tsconfig.json',
      tsconfigRootDir: __dirname
    }
  },

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-var-requires': 'off'
  }
}, {
  files: ['**/*.ts']
}]
