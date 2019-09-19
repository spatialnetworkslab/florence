import { pointInPolygon } from '../../../../utils/geometryUtils'

export default function polygonCollision (coordinates, polygonAttributes) {
  const point = [coordinates.x, coordinates.y]
  return pointInPolygon(point, polygonAttributes.screenGeometry)
}
