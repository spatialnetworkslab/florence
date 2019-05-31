import pointDistance from './pointDistance.js'

export function pointIntersectsLineSegment (point, lineSegment, treshold) {
  let distance = distanceClosestPointOnLineSegment(point, lineSegment)

  return distance < (treshold / 2)
}

export function distanceClosestPointOnLineSegment (point, lineSegment) {
  let closestPoint = closestPointOnLineSegment(point, lineSegment)
  return pointDistance(point, closestPoint)
}

// https://stackoverflow.com/a/6853926/7237112
export function closestPointOnLineSegment (point, lineSegment) {
  // Point coordinates
  let x = point[0]
  let y = point[1]

  // Line segment coordinates
  let x1 = lineSegment[0][0]
  let y1 = lineSegment[0][1]
  let x2 = lineSegment[1][0]
  let y2 = lineSegment[1][1]

  let A = x - x1
  let B = y - y1
  let C = x2 - x1
  let D = y2 - y1

  let dot = A * C + B * D
  let lengthSquared = C * C + D * D
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
