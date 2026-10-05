/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  // Se miden TODOS los archivos de logica, aunque ningun test los importe.
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  // La consigna exige cobertura de lineas estrictamente superior al 90 %.
  coverageThreshold: { global: { lines: 90.01 } },
};
