import { pointInPolygon } from '../../../../utils/geometryUtils'

export default function areaCollision (coordinates, areaAttributes) {
  const point = [coordinates.x, coordinates.y]
  return pointInPolygon(point, areaAttributes.screenGeometry)
}
