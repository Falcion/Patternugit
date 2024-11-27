import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import globals from 'globals'
import eslintPluginJsonc from 'eslint-plugin-jsonc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  // Global ignore patterns
  ignores: ['**/node_modules/', '**/dist/', '**/out/', '**/prepare_template.js', '*.d.ts'],

  // JavaScript-specific configuration
  overrides: [
    {
      files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: {
          ...globals.node,
          ...globals.browser,
          ...globals.es2016
        }
      }
    },

    // TypeScript-specific configuration
    {
      files: ['**/*.ts', '**/*.tsx'],
      ignores: ['**/*.d.ts'],
      plugins: {
        '@typescript-eslint': typescriptEslint
      },
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: './tsconfig.json',
          tsconfigRootDir: __dirname
        }
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],

  // ESLint recommended and TypeScript recommended configurations
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsonc/recommended-with-jsonc'
  ],

  // Add other rules or plugins as necessary
  plugins: {
    '@typescript-eslint': typescriptEslint,
    jsonc: eslintPluginJsonc
  }
}
