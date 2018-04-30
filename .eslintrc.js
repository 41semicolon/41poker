module.exports = {
  extends: 'airbnb-base',
  rules: {
    'max-len': 'off',
    'no-console': 'off',
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
