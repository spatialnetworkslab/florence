import { pointDistance } from './distance.js'

export function pointIntersectsLineSegment (point, lineSegment, lineWidth) {
  const distance = distanceClosestPointOnLineSegment(point, lineSegment)

  return distance < (lineWidth / 2)
}

export function distanceClosestPointOnLineSegment (point, lineSegment) {
  const closestPoint = closestPointOnLineSegment(point, lineSegment)
  return pointDistance(point, closestPoint)
}

// https://stackoverflow.com/a/6853926/7237112
export function closestPointOnLineSegment (point, lineSegment) {
  // Point coordinates
  const x = point[0]
  const y = point[1]

  // Line segment coordinates
  const x1 = lineSegment[0][0]
  const y1 = lineSegment[0][1]
  const x2 = lineSegment[1][0]
  const y2 = lineSegment[1][1]

  const A = x - x1
  const B = y - y1
  const C = x2 - x1
  const D = y2 - y1

  const dot = A * C + B * D
  const lengthSquared = C * C + D * D
  let param = -1
  if (lengthSquared !== 0) { // in case of 0 length line
    param = dot / lengthSquared
  }

  let xx, yy

  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }

  return [xx, yy]
}
