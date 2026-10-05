module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: { global: { lines: 90.01 } },
};
