// There are three ways of setting the position of the axis, in order of precedence
// 1. vjust with 'bottom', 'center' or 'top'
// 2. vjust with a number (relative position within content of section)
// 3. x1, x2, y1, y2 props with positioning in data coords

export function createPosYCoords (vjust, yRange, orient, height, offset, titleFontSize) {
  let y1
  let y2
  const y1Range = yRange[0]
  const y2Range = yRange[1]
  const heightRatio = orient === 'vertical' ? 0.3 : 0.1
  height = (height === 0 || height === undefined) ? (y2Range - y1Range) * heightRatio : height
  const addTitleSize = titleFontSize * 4

  if (vjust === 'top') {
    y1 = y1Range + offset + addTitleSize
    y2 = y1Range + height + offset + addTitleSize
  }
  if (vjust === 'center' || vjust === 'centre') {
    const yCoord = (y2Range - y1Range) * 0.5 + y1Range
    y1 = yCoord - height / 2 + offset + addTitleSize
    y2 = yCoord + height / 2 + offset + addTitleSize
  }
  if (vjust === 'bottom') {
    y1 = y2Range - height + offset - addTitleSize
    y2 = y2Range + offset - addTitleSize
  }

  if (!isNaN(vjust) && (vjust <= 1 && vjust >= -1)) {
    const yCoord = (y2Range - y1Range) * vjust + y1Range
    y1 = yCoord + offset - addTitleSize
    y2 = yCoord + height + offset - addTitleSize
  }

  if (!['top', 'bottom', 'center'].includes(vjust) && y1 === undefined) {
    throw Error('Please specify either `top`, `center`, `bottom` or a number in the range [-1, 1] for `vjust`')
  }

  return { y1, y2, height }
}

export function createPosXCoords (hjust, xRange, orient, width, offset, labelFontSize) {
  let x1
  let x2
  const x1Range = xRange[0]
  const x2Range = xRange[1]
  const widthRatio = orient === 'vertical' ? 0.1 : 0.3
  width = width === 0 ? (x2Range - x1Range) * widthRatio : width

  if (hjust === 'left') {
    x1 = x1Range + offset + labelFontSize
    x2 = x1Range + width + offset + labelFontSize
  }
  if (hjust === 'center' || hjust === 'centre') {
    const xCoord = (x2Range - x1Range) * 0.5 + x1Range
    x1 = xCoord - width / 2 + offset
    x2 = xCoord + width / 2 + offset
  }

  if (hjust === 'right') {
    x1 = x2Range - width + offset - labelFontSize
    x2 = x2Range + offset - labelFontSize
  }

  if (!isNaN(hjust)) {
    const xCoord = (x2Range - x1Range) * hjust + x1Range
    x1 = xCoord - labelFontSize
    x2 = xCoord + width - labelFontSize
  }

  if (!['left', 'center', 'right'].includes(hjust) && x1 === undefined) {
    throw Error('Please specify either `left`, `center`, `right` or a number from 0 to 1 for `vjust`')
  }

  return { x1, x2, width }
}

export function createTitleXCoord (hjust, xCoords, x, offset, fontSize, padding) {
  if (x) {
    return () => x
  }

  const x1 = xCoords.x1
  const x2 = xCoords.x2
  let justification
  let addFontSize

  if (hjust === 'center' || hjust === 'centre') {
    justification = 0.5
    addFontSize = 0
  }
  if (hjust === 'left') {
    justification = 0
    addFontSize = fontSize
  }
  if (hjust === 'right') {
    justification = 1
    addFontSize = -fontSize
  }
  if (!isNaN(hjust)) {
    justification = hjust
    addFontSize = 0
  }
  if (justification === undefined) {
    justification = 0.5
    addFontSize = 0
  }

  if (!['left', 'center', 'right'].includes(hjust) && isNaN(hjust)) {
    throw Error('Please specify either `left`, `center`, `right` or a number from 0 to 1 for `hjust`')
  }

  return x1 + Math.abs(x1 - x2) * justification + addFontSize + padding
}

export function createTitleYCoord (vjust, yCoords, y, offset, fontSize, orient, padding) {
  if (y) {
    return () => y
  }

  const y1 = yCoords.y1
  const y2 = yCoords.y2
  let justification
  let addFontSize

  if (vjust === 'center') {
    justification = 0.5
    addFontSize = 0
  }
  if (vjust === 'bottom') {
    justification = 1
    addFontSize = fontSize
  }
  if (vjust === 'top') {
    justification = -0.05
    addFontSize = -fontSize
  }

  if (!isNaN(vjust)) {
    justification = vjust
    addFontSize = 0
  }

  if (justification === undefined) {
    justification = 0.5
    addFontSize = 0
  }

  if (!['center', 'bottom', 'top'].includes(vjust) && isNaN(vjust)) {
    throw Error('Please specify either `top`, `center`, `bottom` or a number for `vjust`')
  }

  return y1 + Math.abs(y1 - y2) * justification + addFontSize + padding
}
