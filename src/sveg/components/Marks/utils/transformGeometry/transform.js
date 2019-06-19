export function Point (geometry, transformFunc) {
  return {
    type: 'Point',
    coordinates: transformFunc(geometry.coordinates)
  }
}

export function LineString (geometry, transformFunc, visibilityTreshold) {
  let points = geometry.coordinates
  let transformedPoints = []

  for (let i = 0; i < points.length; i++) {
    transformedPoints.push(transformFunc(points[i]))
  }

  return {
    type: 'LineString',
    coordinates: transformedPoints
  }
}
