module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: ['plugin:vue/essential', 'standard'],

  plugins: [],

  globals: {
    __statics: true,
    process: true,
    Capacitor: true,
    chrome: true
  },

  rules: {
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    'new-cap': 'off',
    'no-undef': 'off'
  }
}
