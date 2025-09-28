module.exports = {
  root: true,
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'coverage/',
    '*.config.js',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],
  env: {
    node: true,
    es2022: true,
    jest: true
  }
};
