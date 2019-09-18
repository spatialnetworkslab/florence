import { pointDistance } from '../../../utils/geometryUtils/index.js'

export default function pointCollision (coordinates, pointAttributes) {
  const distance = pointDistance(
    [coordinates.x, coordinates.y],
    pointAttributes.pixelGeometry.coordinates
  )

  return distance < pointAttributes.radius
}
