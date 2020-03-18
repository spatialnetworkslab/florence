export function parsePadding (padding) {
  if (padding.constructor === Number) {
    return { left: padding, right: padding, top: padding, bottom: padding }
  }

  if (padding.constructor === Object) {
    if (Object.keys(padding).length !== 4) throw invalidPaddingError

    for (const key of ['left', 'right', 'top', 'bottom']) {
      if (!(key in padding)) throw invalidPaddingError
    }

    return padding
  }

  throw invalidPaddingError
}

const invalidPaddingError = new Error('Invalid padding specification')

export function applyPadding (range, offsetMin, offsetMax) {
  if (range[0] < range[1]) {
    return [range[0] + offsetMin, range[1] - offsetMax]
  } else {
    return [range[0] - offsetMax, range[1] + offsetMin]
  }
}

export function removePadding (range, offsetMin, offsetMax) {
  if (range[0] < range[1]) {
    return [range[0] - offsetMin, range[1] + offsetMax]
  } else {
    return [range[0] + offsetMax, range[1] - offsetMin]
  }
}

