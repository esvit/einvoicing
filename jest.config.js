module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true, tsconfig: "tsconfig.test.json" }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!build/**',
    '!src/**/*.d.mts',
  ],
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  setupFilesAfterEnv: ['<rootDir>/tests/matchers/to-match-xml.ts'],
};
