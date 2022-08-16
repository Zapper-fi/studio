const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  name: 'studio-e2e',
  testMatch: ['<rootDir>/src/**/__tests__/**/+(*.)+(e2e).+(ts|js)?(x)'],
};
