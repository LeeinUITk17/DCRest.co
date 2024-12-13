module.exports = {
    extends: [
      '@nuxtjs/eslint-config-typescript',
      'plugin:nuxt/recommended',
      'prettier'
    ],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, semi: false }],
    }
  }
  