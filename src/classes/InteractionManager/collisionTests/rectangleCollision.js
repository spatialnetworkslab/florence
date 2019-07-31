import { pointInPolygon } from '../../../utils/geometryUtils/index.js'

export default function rectangleCollision (coordinates, rectangleAttributes) {
  const point = [coordinates.x, coordinates.y]
  return pointInPolygon(point, rectangleAttributes.screenGeometry)
}
