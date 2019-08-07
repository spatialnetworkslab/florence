export function createXAxisCoords (vjust, y, offset, scaleX, scaleY) {
  // there are three ways of setting the position of the axis, in order of precedence
  // 1. vjust with 'bottom', 'center' or 'top'
  // 2. vjust with a number (relative position within content of section
  // 3. y prop with either a single number (positioning in data coords)
  //    or a function that returns an array of 2 numbers (in pixel coords)

  const x1 = scaleX.range()[0]
  const x2 = scaleX.range()[1]
  const y1 = scaleY.range()[0]
  const y2 = scaleY.range()[1]
  const xCoords = () => {
    return [x1, x2]
  }

  let yCoords

  if (vjust === 'bottom') {
    yCoords = () => {
      return [y1 + offset, y1 + offset]
    }
  }
  if (vjust === 'center') {
    const yCoord = (y2 - y1) * 0.5 + y1
    yCoords = () => {
      return [yCoord + offset, yCoord + offset]
    }
  }
  if (vjust === 'top') {
    yCoords = () => {
      return [y2 - offset, y2 - offset]
    }
  }
  if (!isNaN(vjust)) {
    const yCoord = (y2 - y1) * vjust + y1
    yCoords = () => {
      return [yCoord, yCoord]
    }
  }
  if (!isNaN(y)) {
    yCoords = () => [scaleY(y), scaleY(y)]
  }
  if (typeof y === 'function') {
    yCoords = y
  }
  if (yCoords === undefined) {
    // we still haven't set yCoords
    // which means we don't have a y prop and a non-valid vjust prop
    // probably should throw warning
    yCoords = () => {
      return [y1 + offset, y1 + offset]
    }
  }
  return { xCoords, yCoords }
}

export function createTitleXCoord (hjust, axisXCoords, x, scaleX, scaleY, offset, axisHeight, flip, fontSize) {
  if (x) {
    return () => x
  }
  const x1 = scaleX.range()[0]
  const x2 = scaleX.range()[1]
  let justification

  if (hjust === 'axis') {
    return () => axisXCoords()[0]
  }
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
  return () => x1 + Math.abs(x1 - x2) * justification + offset
}

export function createTitleYCoord (vjust, axisYCoords, y, scaleX, scaleY, offset, height, flip, fontSize) {
  if (y) {
    return () => y
  }
  const y1 = scaleY.range()[0]
  const y2 = scaleY.range()[1]
  let heightOffset
  if (offset === 'axis') {
    heightOffset = height + 1
    if (flip) heightOffset = -heightOffset - fontSize
  } else {
    heightOffset = offset
  }
  let justification

  if (vjust === 'axis') {
    return () => axisYCoords()[0] + heightOffset
  }

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
  return () => y1 - Math.abs(y1 - y2) * justification + heightOffset
}

export function generateXTickGeoms (tickPositions, yCoords, scale, baseLineWidth, tickSize, flip) {
  const x = []
  const y = []
  const yStart = yCoords()[0]
  let offset = baseLineWidth / 2 + tickSize
  if (flip) offset = -offset
  for (let index = 0; index < tickPositions.length; index++) {
    const tick = scale(tickPositions[index])
    x.push([tick, tick])
    y.push([yStart, yStart + offset])
  }
  return { tickXCoords: () => x, tickYCoords: () => y }
}

export function generateXLabelGeoms (tickPositions, yCoords, scale, baseLineWidth, tickSize, labelOffset, flip) {
  const x = []
  const y = []
  const yStart = yCoords()[0]
  let offset = baseLineWidth / 2 + tickSize + labelOffset
  if (flip) offset = -offset
  for (let index = 0; index < tickPositions.length; index++) {
    const tick = scale(tickPositions[index])
    x.push(tick)
    y.push(yStart + offset)
  }
  return { tickLabelXCoords: () => x, tickLabelYCoords: () => y }
}
