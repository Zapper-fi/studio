module.exports = {
  name: 'studio-integration',
  testEnvironment: 'node',
  clearMocks: true,
  transformIgnorePatterns: ['node_modules'],
  testMatch: ['<rootDir>/src/app/__tests__/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|js|html)$': '@swc/jest',
  },
  setupFilesAfterEnv: ['jest-expect-message'],
};
