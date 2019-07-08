export default function (layerName) {
  return function (x, y) {
    if (x.constructor !== Array && y.constructor !== Array) {
      throw new Error(`${layerName}: at least 'x' or 'y' must evaluate to an Array`)
    }

    let length = x.constructor === Array ? x.length : y.length

    if (x.constructor === Array && y.constructor === Array) {
      if (x.length !== length || y.length !== length) {
        throw new Error(`${layerName}: 'x' and 'y' have different lengths`)
      }
    }

    return length
  }
}
