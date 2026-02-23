import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist'] },
  ...(Array.isArray(js.configs.recommended) ? js.configs.recommended : [js.configs.recommended]),
  ...(Array.isArray(tseslint.configs.recommended) ? tseslint.configs.recommended : [tseslint.configs.recommended]),
  ...(Array.isArray(reactHooks.configs.flat.recommended) ? reactHooks.configs.flat.recommended : [reactHooks.configs.flat.recommended]),
  ...(Array.isArray(reactRefresh.configs.vite) ? reactRefresh.configs.vite : [reactRefresh.configs.vite]),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
]
