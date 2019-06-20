import { coordEach } from '@turf/meta'

export function scaleGeometries (geometries, scaleX, scaleY) {
  let scaleTransformation = position => [scaleX(position[0]), scaleY(position[1])]
  return transformGeometries(geometries, scaleTransformation)
}

export function transformGeometries (geometries, transformation) {
  let geometriesClone = JSON.parse(JSON.stringify(geometries))
  return geometriesClone.map(geometry => transformGeometryInplace(geometry, transformation))
}

export function scaleGeometry (geometry, scaleX, scaleY) {
  let scaleTransformation = position => [scaleX(position[0]), scaleY(position[1])]
  let geometryClone = JSON.parse(JSON.stringify(geometry))
  return transformGeometryInplace(geometryClone, scaleTransformation)
}

export function transformGeometry (geometry, transformation) {
  let geometryClone = JSON.parse(JSON.stringify(geometry))
  return transformGeometryInplace(geometryClone, transformation)
}

function transformGeometryInplace (geometry, transformation) {
  coordEach(geometry, coord => {
    let [x, y] = transformation(coord)
    coord[0] = x
    coord[1] = y
  })
  return geometry
}
