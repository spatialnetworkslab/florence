export function point (point, transformFunc) {
  return transformFunc(point)
}

export function pointArray (points, transformFunc, visibilityTreshold) {
  return points.map(transformFunc)
}
