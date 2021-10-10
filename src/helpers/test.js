export function testId (input) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return input
  }
}
