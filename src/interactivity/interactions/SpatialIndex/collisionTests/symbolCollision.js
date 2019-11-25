import { pointInPolygon } from '../../../../utils/geometryUtils'

export default function areaCollision (coordinates, symbolAttributes) {
  const point = [coordinates.x, coordinates.y]
  return pointInPolygon(point, symbolAttributes.screenGeometry)
}
