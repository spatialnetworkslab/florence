export function warn (message) {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(message)
  }
}