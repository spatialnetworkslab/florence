export default function (padding) {
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