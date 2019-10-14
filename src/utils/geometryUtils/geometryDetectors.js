export function isLinearRing (ring) {
  return ring.constructor === Array
}

export function isPolygon (geometry) {
  return geometry.constructor === Object && geometry.type === 'Polygon'
}

export function isMultiPolygon (geometry) {
  return geometry.constructor === Object && geometry.type === 'MultiPolygon'
}

export function isPolygonOrMultiPolygon (geometry) {
  return isPolygon(geometry) || isMultiPolygon(geometry)
}

export function isLineString (geometry) {
  return geometry.constructor === Object && geometry.type === 'LineString'
}

export function isMultiLineString (geometry) {
  return geometry.constructor === Object && geometry.type === 'MultiLineString'
}

export function isLineStringOrMultiLineString (geometry) {
  return isLineString(geometry) || isMultiLineString(geometry)
}
