export function point (points, transformFunc) {
  return transformFunc(point)
}

export function pointArray (points, transformFunc, visibilityTreshold) {
  return points.map(transformFunc)
}
