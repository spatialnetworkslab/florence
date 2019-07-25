export function representLineAsPolygon (lineString, { strokeWidth }) {
  const length = lineString.coordinates.length

  const coordinatesBottom = new Array(length)
  const coordinatesTop = new Array(length)

  const beginCornerPoints = getBeginCornerPoints(lineString, strokeWidth)
  coordinatesBottom[0] = beginCornerPoints.bottom
  coordinatesTop[length - 1] = beginCornerPoints.top

  for (let i = 1; i < length - 1; i++) {
    const cornerPoints = getCornerPointsAtIndex(lineString.coordinates, strokeWidth, i)
    coordinatesBottom[i] = cornerPoints.bottom
    coordinatesTop[length - i] = cornerPoints.top
  }

  const endCornerPoints = getEndCornerPoints(lineString, strokeWidth)
  coordinatesBottom[length - 1] = endCornerPoints.bottom
  coordinatesTop[0] = endCornerPoints.top

  const outerRing = coordinatesBottom.append(coordinatesTop)

  // TODO: close ring
  // TODO: check winding order?

  return {
    type: 'Polygon',
    coordinates: [outerRing]
  }
}

function getBeginCornerPoints (coordinates, strokeWidth) {
  const a = coordinates[0]
  const b = coordinates[1]

  const slope = getSlope(a, b)
  const perpendicularSlope = flipSlope(slope)

  const deltas = getXAndYDeltas(a, strokeWidth / 2, perpendicularSlope)
  return getCornerPoints(a, deltas)
}

function getCornerPointsAtIndex (coordinates, strokeWidth, index) {
  const segmentBeforeCorner = [coordinates[index - 1], coordinates[index]]
  const segmentAfterCorner = [coordinates[index], coordinates[index + 1]]

  const slopeBefore = getSlope(...segmentBeforeCorner)
  const slopeAFter = getSlope(...segmentAfterCorner)

  
}

function getEndCornerPoints (coordinates, strokeWidth) {
  const length = coordinates.length
  
  const a = coordinates[length - 2]
  const b = coordinates[length - 1]

  const slope = getSlope(a, b)
  const perpendicularSlope = flipSlope(slope)

  const deltas = getXAndYDeltas(a, strokeWidth / 2, perpendicularSlope)
  return getCornerPoints(b, deltas)
}

function getSlope (a, b) {
  return (b[1] - a[1]) / (b[0] - a[0])
}

function flipSlope (slope) {
  return -(1 / slope)
}

// https://www.geeksforgeeks.org/find-points-at-a-given-distance-on-a-line-of-given-slope/
function getXAndYDeltas (fromPoint, distance, slope) {
  if (slope === 0) {
    return { x: distance, y: 0 }
  }

  if (slope === Infinity) {
    return { x: 0, y: distance }
  }

  const x = distance / Math.sqrt(1 + (slope * slope))
  const y = slope * x

  return [x, y]
}

function getCornerPoints (center, deltas) {
  let bottomPoint
  let topPoint

  if (deltas.y < 0) {
    bottomPoint = [center[0] + deltas[0], center[1] + deltas[1]]
    topPoint = [center[0] - deltas[0], center[1] - deltas[1]]
  }

  if (deltas.y > 0) {
    bottomPoint = [center[0] - deltas[0], center[1] - deltas[1]]
    topPoint = [center[0] + deltas[0], center[1] + deltas[1]]
  }

  return { bottom: bottomPoint, top: topPoint }
}
