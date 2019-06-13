import pointDistance from '../../../../../../utils/geometry/pointDistance.js'

export default function pointCollision (coordinates, geometry) {
  let distance = pointDistance([coordinates.x, coordinates.y], [geometry.x, geometry.y])
  return distance < geometry.radius
}
