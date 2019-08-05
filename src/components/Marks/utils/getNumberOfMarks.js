export default function (x, y, markType) {
  if (x.constructor !== Array && y.constructor !== Array) {
    throw new Error(`${markType}Layer: at least 'x' or 'y' must evaluate to an Array`)
  }

  const length = x.constructor === Array ? x.length : y.length

  if (x.constructor === Array && y.constructor === Array) {
    if (x.length !== length || y.length !== length) {
      throw new Error(`${markType}Layer: 'x' and 'y' have different lengths`)
    }
  }

  return length
}
