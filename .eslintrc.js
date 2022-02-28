/** eslint-ignore */
module.exports = {
  ignorePatterns: ['dist', 'node_modules'],
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    /** enables `<script setup>` */
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    /** enables `<script setup>` */
    'vue/script-setup-uses-vars': 'error',
    // other rules
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'vue/component-tags-order': [
      'error',
      { order: ['script', 'template', 'style'] }
    ],
    'vue/attribute-hyphenation': ['error', 'never', { ignore: [] }],
    'vue/v-on-event-hyphenation': ['error', 'never'],

    'no-irregular-whitespace': 'off',

    '@typescript-eslint/explicit-module-boundary-types': 'off' // temporary during transition phase
  },
  globals: {
    defineProps: 'readonly'
  }
}
