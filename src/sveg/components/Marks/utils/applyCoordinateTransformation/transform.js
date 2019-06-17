export function Point (point, transformFunc) {
  return transformFunc(point)
}

export function LineString (geometry, transformFunc, visibilityTreshold) {
  let transformedGeometry = []

  for (let i = 0; i < geometry.length; i++) {
    transformedGeometry.push(transformFunc(geometry[i]))
  }

  return transformedGeometry
}
