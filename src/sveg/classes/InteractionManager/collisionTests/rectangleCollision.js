import { pointInGeometry } from 'geometryUtils'

export default function rectangleCollision (coordinates, rectangleAttributes) {
  let point = [coordinates.x, coordinates.y]
  return pointInGeometry(point, rectangleAttributes.screenGeometry)
}
