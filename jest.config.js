module.exports = {
  verbose: true,
  testMatch: [
    '**/*.test.js',
    '**/*.test.svelte'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svelte$': 'svelte-jester',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@snlab/rendervous|d3-path|d3-scale|d3-shape|d3-array|d3-interpolate|d3-color|d3-format|d3-time|d3-time-format|internmap)/)'
  ],
  testPathIgnorePatterns: [
    '/__data__/'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './test/unit/setup.js'
  ]
}
