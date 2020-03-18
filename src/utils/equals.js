export function isInvalid (value) {
  if (value === undefined || value === null) { return true }

  if (value.constructor === Number) {
    return !isFinite(value)
  }

  return false
}

export function isValid (value) {
  return !isInvalid(value)
}

export function isDefined (value) {
  return value !== undefined
}

export function isUndefined (value) {
  return value === undefined
}
