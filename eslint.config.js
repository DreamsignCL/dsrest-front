import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],

  configPrettier,

  {
    plugins: {
      prettier,
    },

    rules: {
      /*
       |--------------------------------------------------------------------------
       | GENERAL
       |--------------------------------------------------------------------------
       */

      'no-console': 'warn',
      'no-debugger': 'warn',

      'prefer-const': 'error',

      'no-var': 'error',

      /*
       |--------------------------------------------------------------------------
       | PRETTIER
       |--------------------------------------------------------------------------
       */

      'prettier/prettier': [
        'warn',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 100,
          tabWidth: 2,
        },
      ],

      /*
       |--------------------------------------------------------------------------
       | VUE
       |--------------------------------------------------------------------------
       */

      'vue/multi-word-component-names': 'off',

      'vue/html-indent': ['warn', 2],

      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: 3,
          multiline: 1,
        },
      ],

      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
        },
      ],

      'vue/block-lang': [
        'error',
        {
          script: {
            lang: ['js'],
          },
          style: {
            lang: ['scss', 'css'],
          },
        },
      ],
    },
  },
]
