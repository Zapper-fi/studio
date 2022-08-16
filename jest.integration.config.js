const defaultConfig = require('./jest.config');

module.exports = {
  ...defaultConfig,
  name: 'studio-integration',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/src/app/__tests__/**/+(*.)+(spec|test).+(ts|js)?(x)'],
};
