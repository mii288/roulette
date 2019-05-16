module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest': true
  },
  'extends': [
    'standard',
    'plugin:react/recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  'plugins': [
    'react',
    '@typescript-eslint',
    'jest'
  ],
  'rules': {
    'no-unused-vars': 'off',
    "react/jsx-uses-vars": 'error',
    '@typescript-eslint/no-unused-vars': 'error'
  }
}
