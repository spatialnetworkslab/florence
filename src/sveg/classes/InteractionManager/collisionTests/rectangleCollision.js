import pointInGeometry from '../../../utils/geometry/pointInGeometry.js'

export default function rectangleCollision (coordinates, rectangeAttributes) {
  let point = [coordinates.x, coordinates.y]
  return pointInGeometry(point, rectangeAttributes.screenGeometry)
}
