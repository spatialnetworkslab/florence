export const TEST_ENV = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'

export function testId (input) {
  if (TEST_ENV) {
    return input
  }
}
