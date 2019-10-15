import robustPointInPolygon from 'robust-point-in-polygon'

export default function (point, geometry) {
  switch (geometry.type) {
    case 'Polygon': return pointInPolygon(point, geometry)
    case 'MultiPolygon': return pointInMultiPolygon(point, geometry)
  }
}

function pointInPolygon (point, geometry) {
  const coordinates = geometry.coordinates
  return pointInPolygonCoordinates(point, coordinates)
}

function pointInPolygonCoordinates (point, coordinates) {
  const outerRing = coordinates[0]

  if (!pointInRing(point, outerRing)) return false

  for (let i = 1; i < coordinates.length; i++) {
    const hole = coordinates[i]

    if (pointInRing(point, hole)) return false
  }

  return true
}

function pointInMultiPolygon (point, geometry) {
  const coordinates = geometry.coordinates

  for (let i = 0; i < coordinates.length; i++) {
    const polygonCoordinates = coordinates[i]

    if (pointInPolygonCoordinates(point, polygonCoordinates)) return true
  }

  return false
}

function pointInRing (point, coordinates) {
  return robustPointInPolygon(coordinates, point) === -1
}
