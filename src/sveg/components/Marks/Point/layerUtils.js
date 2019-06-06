export function getNPoints (x, y) {
  if (x.constructor !== Array && y.constructor !== Array) {
    throw new Error('PointLayer: x, y, or both must be an Array.')
  }

  return x.constructor === Array ? x.length : y.length
}