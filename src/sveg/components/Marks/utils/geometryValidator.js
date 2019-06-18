export default function (allowedGeometries) {
  return function geometryValidator (geometry) {
    if (geometryHasCorrectMembers(geometry)) {
      if (geometryIsAllowed(geometry, allowedGeometries)) {
        return
      }

      throw geometryNotAllowedError(geometry)
    }

    throw invalidGeometryError(geometry)
  }
}

function geometryHasCorrectMembers (geometry) {
  return geometry.hasOwnProperty('type') &&
    geometry.hasOwnProperty('coordinates') &&
    Object.keys(geometry).length === 2
}

function geometryIsAllowed (geometry, allowedGeometries) {
  return allowedGeometries.includes(geometry)
}

function geometryNotAllowedError (geometry) {
  throw new Error(`Invalid geometry type: '${geometry.type}`)
}

function invalidGeometryError (geometry) {
  throw new Error(`Invalid geometry: ${JSON.stringify(geometry)}`)
}
