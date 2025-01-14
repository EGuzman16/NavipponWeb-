const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@state': path.resolve(__dirname, 'src/state'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@pages': path.resolve(__dirname, 'src/pages'),
  };
  return config;
};
