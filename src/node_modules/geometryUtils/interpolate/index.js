import interpolateRing from './interpolateRing.js'

export function interpolateGeometries (geometries, transformFunc, visibilityTreshold = 1) {
  const interpolatedGeometries = []

  if (geometries.constructor === Array) {
    for (let i = 0; i < geometries.length; i++) {
      interpolatedGeometries.push(interpolateGeometry(geometries[i], transformFunc, visibilityTreshold))
    }
  }

  if (geometries.constructor === Object) {
    for (const key in geometries) {
      interpolatedGeometries.push(interpolateGeometry(geometries[key], transformFunc, visibilityTreshold))
    }
  }

  return interpolateGeometries
}

export function interpolateGeometry (geometry, transformFunc, visibilityTreshold = 1) {
  switch (geometry.type) {
    case 'LineString': return interpolateLineString(geometry, transformFunc, visibilityTreshold)
    case 'Polygon': return interpolatePolygon(geometry, transformFunc, visibilityTreshold)
    case 'MultiPolygon': return interpolateMultiPolygon(geometry, transformFunc, visibilityTreshold)
  }
}

function interpolateLineString (geometry, transformFunc, visibilityTreshold) {
  const coordinates = geometry.coordinates
  const interpolatedCoordinates = interpolateRing(coordinates, transformFunc, visibilityTreshold)

  return {
    type: 'LineString',
    coordinates: interpolatedCoordinates
  }
}

function interpolatePolygon (geometry, transformFunc, visibilityTreshold) {
  const coordinates = geometry.coordinates
  const interpolatedCoordinates = []

  for (let i = 0; i < coordinates.length; i++) {
    const ring = coordinates[i]
    const interpolatedRing = interpolateRing(ring, transformFunc, visibilityTreshold)
    interpolatedCoordinates.push(interpolatedRing)
  }

  return {
    type: 'Polygon',
    coordinates: interpolatedCoordinates
  }
}

function interpolateMultiPolygon (geometry, transformFunc, visibilityTreshold) {
  const coordinates = geometry.coordinates
  const interpolatedCoordinates = []

  for (let i = 0; i < coordinates.length; i++) {
    const polygon = coordinates[i]
    const interpolatedPolygon = []

    for (let j = 0; j < polygon.length; j++) {
      const ring = polygon[j]
      const interpolatedRing = interpolateRing(ring, transformFunc, visibilityTreshold)
      interpolatedPolygon.push(interpolatedRing)
    }

    interpolatedCoordinates.push(interpolatedPolygon)
  }

  return {
    type: 'MultiPolygon',
    coordinates: interpolatedCoordinates
  }
}
