import pointDistance from '../../../utils/geometry/pointDistance.js'

export default function pointCollision (coordinates, pointAttributes) {
  let distance = pointDistance(
    [coordinates.x, coordinates.y],
    pointAttributes.screenGeometry.coordinates
  )

  return distance < pointAttributes.radius
}
