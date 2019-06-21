import pointInPolygon from '../../../utils/geometry/pointInPolygon.js'

export default function rectangleCollision (coordinates, geometry) {
  let point = [coordinates.x, coordinates.y]
  return pointInPolygon(point, geometry)
}
