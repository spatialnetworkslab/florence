import { pointDistance } from 'geometryUtils'

export function representLineAsPolygon (lineString, { strokeWidth }) {
  const length = lineString.coordinates.length
  const lastIndex = length - 1
  const distance = strokeWidth / 2

  const coordinatesBottom = new Array(length)
  const coordinatesTop = new Array(length)

  for (let i = 0; i < length; i++) {
    if (i === 0) {
      const [bottomPoint, topPoint] = getCornerPointsStart(lineString, distance)
      coordinatesBottom[0] = bottomPoint
      coordinatesTop[lastIndex] = topPoint
    }

    if (i === lastIndex) {
      const [bottomPoint, topPoint] = getCornerPointsEnd(lineString, distance)
      coordinatesBottom[lastIndex] = bottomPoint
      coordinatesTop[0] = topPoint
    }

    if (i > 0 && i < lastIndex) {
      const [bottomPoint, topPoint] = getCornerPointsIndex(lineString, i, distance)
      coordinatesBottom[i] = bottomPoint
      coordinatesTop[lastIndex - i] = topPoint
    }
  }

  const outerRing = coordinatesBottom.concat(coordinatesTop)

  // Close ring
  // TODO: only close if necessary
  outerRing.push(outerRing[0])

  console.log(outerRing)

  // TODO: check winding order?

  return {
    type: 'Polygon',
    coordinates: [outerRing]
  }
}

function getCornerPointsStart (lineString, distance) {
  const segment = getNextSegment(0, lineString.coordinates)
  const cornerPoint = segment[0]

  return getParallelPoints(segment, cornerPoint, distance)
}

function getCornerPointsEnd (lineString, distance) {
  const segment = getPreviousSegment(lineString.coordinates.length - 1, lineString.coordinates)
  const cornerPoint = segment[1]

  return getParallelPoints(segment, cornerPoint, distance)
}

function getCornerPointsIndex (lineString, index, distance) {
  const previousSegment = getPreviousSegment(index, lineString.coordinates)
  const nextSegment = getNextSegment(index, lineString.coordinates)

  const previousUnitVector = getUnitVector(previousSegment)
  const nextUnitVector = getUnitVector(nextSegment)

  if (previousUnitVector[0] === nextUnitVector[0] && previousUnitVector[1] === nextUnitVector[1]) {
    // unit vectors are the same, we can just use the existing line point

    const currentCornerPerpendicularPoints = getParallelPoints(
      previousSegment, previousSegment[1], distance
    )

    return currentCornerPerpendicularPoints
  } else {
    const previousCornerPerpendicularPoints = getParallelPoints(
      previousSegment, previousSegment[0], distance
    )
    const nextCornerPerpendicularPoints = getParallelPoints(
      nextSegment, nextSegment[1], distance
    )

    const bottomPoint = findIntersection(
      previousCornerPerpendicularPoints[0],
      previousUnitVector,
      nextCornerPerpendicularPoints[0],
      nextUnitVector
    )
    const topPoint = findIntersection(
      previousCornerPerpendicularPoints[1],
      previousUnitVector,
      nextCornerPerpendicularPoints[1],
      nextUnitVector
    )

    return [bottomPoint, topPoint]
  }
}

const getPreviousSegment = (i, coordinates) => [coordinates[i - 1], coordinates[i]]
const getNextSegment = (i, coordinates) => [coordinates[i], coordinates[i + 1]]

function getUnitVector (segment) {
  const [a, b] = segment

  const magnitude = pointDistance(a, b)
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]

  return [dx / magnitude, dy / magnitude]
}

const getNormalVector = vector => [-vector[1], vector[0]]

function movePoint (point, unitVector, distance) {
  return [
    point[0] + unitVector[0] * distance,
    point[1] + unitVector[1] * distance
  ]
}

export function getParallelPoints (segment, point, distance) {
  const unitVector = getUnitVector(segment)
  const normalVector = getNormalVector(unitVector)

  const bottomPoint = movePoint(point, normalVector, distance)
  const topPoint = movePoint(point, normalVector, -distance)

  return [bottomPoint, topPoint]
}

function findIntersection (point1, vector1, point2, vector2) {
  const lambda1 = findLambda(point1, vector1, point2, vector2)
  return [
    point1[0] + (vector1[0] * lambda1),
    point1[1] + (vector1[1] * lambda1)
  ]
}

export function findLambda (p1, v1, p2, v2) {
  const deltaX = p1[0] - p2[0]
  const deltaY = p1[1] - p2[1]
  const v1x = v1[0]
  const v2x = v2[0]
  const v1y = v1[1]
  const v2y = v2[1]

  const lambda1 = ((v2x * deltaY) - (deltaX * v2y)) /
    ((v1x * v2y) - (v2x * v1y))
  return lambda1
}
