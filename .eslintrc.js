module.exports = {
  extends: 'airbnb-base',
  rules: {
    'max-len': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
  },
  overrides: [
    {
      files: 'test/**/*.js',
      env: {
        jest: true,
      },
    },
  ],
};
