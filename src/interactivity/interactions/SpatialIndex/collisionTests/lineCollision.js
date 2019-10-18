import { pointIntersectsLineSegment } from '../../../../utils/geometryUtils'

export default function lineCollision (coordinates, lineAttributes) {
  const mouseCoordinates = [coordinates.x, coordinates.y]
  return pointIntersectsLineSegment(
    mouseCoordinates,
    lineAttributes.segmentGeometry.coordinates,
    lineAttributes.strokeWidth
  )
}
