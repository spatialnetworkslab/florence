export function isInvalid (value) {
  if (value === undefined || value === null) { return true }

  if (value.constructor === Number) {
    return !isFinite(value)
  }

  return false
}
