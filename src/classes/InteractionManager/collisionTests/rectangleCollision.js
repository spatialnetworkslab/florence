import { pointInPolygon } from 'geometryUtils'

export default function rectangleCollision (coordinates, rectangleAttributes) {
  const point = [coordinates.x, coordinates.y]
  return pointInPolygon(point, rectangleAttributes.screenGeometry)
}
