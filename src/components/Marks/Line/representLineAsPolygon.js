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

  // TODO: close ring
  outerRing.push(outerRing[0])

  // TODO: check winding order?

  return {
    type: 'Polygon',
    coordinates: [outerRing]
  }
}

function getCornerPointsStart (lineString, distance) {
  const segment = getNextSegment(0, lineString.coordinates)
  const unitVector = getUnitVector(segment)
  const normalVector = getNormalVector(unitVector)

  const bottomPoint = movePoint(segment[0], normalVector, distance)
  const topPoint = movePoint(segment[0], normalVector, -distance)

  return [bottomPoint, topPoint]
}

function getCornerPointsEnd (lineString, distance) {
  const segment = getPreviousSegment(lineString.coordinates.length - 1, lineString.coordinates)
  const unitVector = getUnitVector(segment)
  const normalVector = getNormalVector(unitVector)

  const bottomPoint = movePoint(segment[1], normalVector, distance)
  const topPoint = movePoint(segment[1], normalVector, -distance)

  return [bottomPoint, topPoint]
}

function getCornerPointsIndex (lineString, index, distance) {
  const previousSegment = getPreviousSegment(index, lineString.coordinates)
  const nextSegment = getNextSegment(index, lineString.coordinates)

  const previousUnitVector = getUnitVector(previousSegment)
  const nextUnitVector = getUnitVector(nextSegment)

  let bottomPoint
  let topPoint

  // TODO

  return [bottomPoint, topPoint]
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

const getNormalVector = vector => [-vector[0], vector[1]]

function movePoint (point, unitVector, distance) {
  return [
    point[0] + unitVector[0] * distance,
    point[1] + unitVector[1] * distance
  ]
}
