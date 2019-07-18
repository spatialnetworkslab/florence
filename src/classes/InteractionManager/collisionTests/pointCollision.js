import { pointDistance } from 'geometryUtils'

export default function pointCollision (coordinates, pointAttributes) {
  const distance = pointDistance(
    [coordinates.x, coordinates.y],
    pointAttributes.screenGeometry.coordinates
  )

  return distance < pointAttributes.radius
}
