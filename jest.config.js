module.exports = {
  verbose: true,
  testMatch: [
    '**/*.test.js',
    '**/*.test.svelte'
  ],
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules'
  ],
  testPathIgnorePatterns: [
    '/__data__/'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './test/unit/setup.js'
  ]
}
