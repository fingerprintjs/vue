import { defineConfig, includeIgnoreFile } from 'eslint/config'
import dxTeamConfig from '@fingerprintjs/eslint-config-dx-team'
import dxTeamTypeChecked from '@fingerprintjs/eslint-config-dx-team/type-checked'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import { fileURLToPath } from 'node:url'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  {
    ignores: ['**/dist/**', '**/build/**', '**/.nuxt/**', '**/*.d.ts', '__tests__/smoke/**'],
  },
  ...pluginVue.configs['flat/recommended'],
  {
    extends: [dxTeamConfig],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
    },
  },
  {
    files: ['src/**/*.ts', '__tests__/**/*.ts'],
    extends: [dxTeamTypeChecked],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)),
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
])
