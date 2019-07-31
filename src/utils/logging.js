export function warn (message) {
  if (!process) console.warn(message)

  if (process && process.env.NODE_ENV !== 'test') {
    console.warn(message)
  }
}
