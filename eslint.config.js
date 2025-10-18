import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import { includeIgnoreFile } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default [
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  {
    // Global ignore patterns as addition to .gitignore
    ignores: ['**/*.d.ts', '**/*.config.js']
  },
  {
    // JavaScript-specific configuration
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ignores: ['**/venv/'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2022
      }
    }
  },
  {
    // TypeScript-specific configuration
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.d.ts', '**/venv/'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    }
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ),
  ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    "overrides": [
      {
        "files": ["test/**/*.ts", "test/**/*.tsx", "**/*.test.ts"],
        "rules": {
          "n/no-missing-import": "off"
        }
      }
    ]
  }
]
