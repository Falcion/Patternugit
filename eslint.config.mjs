import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    // Global ignore patterns
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
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ),
  {
    // Linting for JavaScript files
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2016
      }
    },
    rules: {
      ...js.configs.recommended.rules // Default ESLint rules for JS
    }
  },
  {
    // Linting for TypeScript files
    files: ['!*.d.ts', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json', // Use your project's tsconfig.json for parsing
        tsconfigRootDir: __dirname
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2016
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
  }
]
