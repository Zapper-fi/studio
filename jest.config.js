module.exports = {
  name: 'studio',
  testEnvironment: 'node',
  clearMocks: true,
  transformIgnorePatterns: ['node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '/src/app/'],
  testMatch: ['<rootDir>/src/**/__tests__/**/+(*.)+(spec|test).+(ts|js)?(x)'],
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
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  setupFilesAfterEnv: ["@alex_neo/jest-expect-message"]
};
