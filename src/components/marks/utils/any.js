export default function (...args) {
  for (const arg of args) {
    if (arg !== undefined) return true
  }

  return false
}
