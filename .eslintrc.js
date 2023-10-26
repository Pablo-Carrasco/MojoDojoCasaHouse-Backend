module.exports = {
    env: {
      commonjs: true,
      es2021: true,
      node: true,
      jest: true,
    },
    extends: 'airbnb-base',
    overrides: [
      {
        env: {
          node: true,
        },
        files: [
          '.eslintrc.{js,cjs}',
        ],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    parserOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
      'import/no-dynamic-require': 'off',
      'global-require': 'off',
    },
  };