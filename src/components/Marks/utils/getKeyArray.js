export default function (keyProp, length) {
  if (keyProp) {
    if (keyProp.constructor !== Array) throw new Error('\'key\' must be Array')
    if (keyProp.length !== length) throw new Error('\'key\' must be of same length as positioning props')
    if (keyProp.some(key => key.constructor !== String)) {
      throw new Error('Keys can only be Strings')
    }

    return keyProp
  } else {
    return new Array(length).fill(0).map((_, i) => i.toString())
  }
}
