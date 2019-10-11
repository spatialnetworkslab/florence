// There are three ways of setting the position of the axis, in order of precedence
// 1. vjust with 'bottom', 'center' or 'top'
// 2. vjust with a number (relative position within content of section
// 3. y prop with either a single number (positioning in data coords)
//    or a function that returns an array of 2 numbers (in pixel coords)

export function createPosYCoords (vjust, yRange, orient, yOffset) {
  let y1
  let y2
  const y1Range = yRange[0]
  const y2Range = yRange[1]
  const heightRatio = orient === 'vertical' ? 0.3 : 0.1
  yOffset = (yOffset === 0 || yOffset === undefined) ? (y2Range - y1Range) * heightRatio : yOffset

  if (vjust === 'top') {
    y1 = y1Range
    y2 = y1Range + yOffset
  }
  if (vjust === 'center') {
    const yCoord = (y2Range - y1Range) * 0.5 + y1Range
    y1 = yCoord - yOffset / 2
    y2 = yCoord + yOffset / 2
  }
  if (vjust === 'bottom') {
    y1 = y2Range - yOffset
    y2 = y2Range
  }

  if (!isNaN(vjust)) {
    const yCoord = (y2Range - y1Range) * vjust + y1Range
    y1 = yCoord
    y2 = yCoord + yOffset
  }

  if (!['top', 'bottom', 'center'].includes(vjust) && y1 === undefined) {
    throw Error('Please specify either `top`, `center`, `bottom` or a number for `vjust`')
  }

  return { y1, y2 }
}

export function createPosXCoords (hjust, xRange, orient, xOffset) {
  let x1
  let x2
  const x1Range = xRange[0]
  const x2Range = xRange[1]
  const widthRatio = orient === 'vertical' ? 0.1 : 0.3
  xOffset = xOffset === 0 ? (x2Range - x1Range) * widthRatio : xOffset

  if (hjust === 'left') {
    x1 = x1Range
    x2 = x1Range + xOffset
  }
  if (hjust === 'center') {
    const xCoord = (x2Range - x1Range) * 0.5 + x1Range
    x1 = xCoord - xOffset / 2
    x2 = xCoord + xOffset / 2
  }

  if (hjust === 'right') {
    x1 = x2Range - xOffset
    x2 = x2Range
  }

  if (!isNaN(hjust)) {
    const xCoord = (x2Range - x1Range) * hjust + x1Range
    x1 = xCoord
    x2 = xCoord + xOffset
  }

  if (!['left', 'center', 'right'].includes(hjust) && x1 === undefined) {
    throw Error('Please specify either `left`, `center`, `right` or a number for `vjust`')
  }

  return { x1, x2 }
}

export function createTitleXCoord (hjust, xCoords, x, offset, width, flip, fontSize) {
  if (x) {
    return () => x
  }

  const x1 = xCoords.x2
  const x2 = xCoords.x1
  let justification

  if (hjust === 'center') {
    justification = 0.5
  }
  if (hjust === 'left') {
    justification = 0
  }
  if (hjust === 'right') {
    justification = 1
  }
  if (!isNaN(hjust)) {
    justification = hjust
  }
  if (justification === undefined) {
    justification = 0.5
  }

  return x1 + Math.abs(x1 - x2) * justification
}

export function createTitleYCoord (vjust, yCoords, y, offset, width, flip, fontSize) {
  if (y) {
    return () => y
  }

  const y1 = yCoords.y1
  const y2 = yCoords.y2
  let justification

  if (vjust === 'center') {
    justification = 0.5
  }
  if (vjust === 'bottom') {
    justification = 0
  }
  if (vjust === 'top') {
    justification = 1
  }
  if (!isNaN(vjust)) {
    justification = vjust
  }
  if (justification === undefined) {
    justification = 0.5
  }
  return y1 - Math.abs(y1 - y2) * justification
}
