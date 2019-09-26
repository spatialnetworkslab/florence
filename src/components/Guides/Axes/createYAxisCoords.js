export function createYAxisCoords (hjust, x, offset, scaleX, scaleY, sectionContext) {
  // there are three ways of setting the position of the axis, in order of precedence
  // 1. vjust with 'bottom', 'center' or 'top'
  // 2. vjust with a number (relative position within content of section
  // 3. y prop with either a single number (positioning in data coords)
  //    or a function that returns an array of 2 numbers (in pixel coords)
  const xRange = scaleX.range()
  const yRange = scaleY.range()
  if (sectionContext.flipX) xRange.reverse()
  if (!sectionContext.flipY) yRange.reverse()
  const x1 = xRange[0]
  const x2 = xRange[1]
  const y1 = yRange[0]
  const y2 = yRange[1]
  const yCoords = () => {
    return [y1, y2]
  }
  let xCoords

  if (hjust === 'left') {
    xCoords = () => {
      return [x1 - offset, x1 - offset]
    }
  }
  if (hjust === 'center') {
    const xCoord = (x2 - x1) * 0.5 + x1
    xCoords = () => {
      return [xCoord + offset, xCoord + offset]
    }
  }
  if (hjust === 'right') {
    xCoords = () => {
      return [x2 + offset, x2 + offset]
    }
  }
  if (!isNaN(hjust)) {
    const xCoord = (x2 - x1) * hjust + x1
    xCoords = () => {
      return [xCoord, xCoord]
    }
  }
  if (!isNaN(x)) {
    xCoords = () => [scaleX(x), scaleX(x)]
  }
  if (typeof x === 'function') {
    xCoords = x
  }
  if (xCoords === undefined) {
    // we still haven't set yCoords
    // which means we don't have a y prop and a non-valid vjust prop
    // probably should throw warning
    xCoords = () => {
      return [x1 + offset, x1 + offset]
    }
  }
  return { xCoords, yCoords }
}

export function createTitleXCoord (hjust, axisXCoords, x, scaleX, scaleY, offset, width, flip, fontSize, sectionContext) {
  if (x) {
    return () => x
  }
  const xRange = scaleX.range()
  if (sectionContext.flipX) xRange.reverse()
  const x1 = xRange[0]
  const x2 = xRange[1]
  let justification
  let widthOffset
  if (offset === 'axis') {
    widthOffset = width * 1.65
    if (flip) widthOffset = -widthOffset - fontSize
  } else {
    widthOffset = offset
  }

  if (hjust === 'axis') {
    return () => axisXCoords()[0] - widthOffset
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
  return () => x1 + Math.abs(x1 - x2) * justification - widthOffset
}

export function createTitleYCoord (vjust, axisYCoords, y, scaleX, scaleY, offset, width, flip, fontSize, sectionContext) {
  if (y) {
    return () => y
  }
  const yRange = scaleY.range()
  if (!sectionContext.flipY) yRange.reverse()
  const y1 = yRange[0]
  const y2 = yRange[1]
  let justification

  if (vjust === 'axis') {
    return () => axisYCoords()[0]
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
  return () => y1 - Math.abs(y1 - y2) * justification + offset
}

export function createYTickGeoms (tickPositions, xCoords, scale, baseLineWidth, tickSize, flip) {
  const x = []
  const y = []

  const xStart = xCoords()[0] - baseLineWidth / 2

  let offset = baseLineWidth + tickSize
  if (!flip) offset = -offset

  const bandOffset = scale.bandwidth ? scale.bandwidth() / 2 : 0

  for (let index = 0; index < tickPositions.length; index++) {
    const tick = scale(tickPositions[index]) + bandOffset
    x.push([xStart, xStart + offset])
    y.push([tick, tick])
  }
  return { tickXCoords: () => x, tickYCoords: () => y }
}

export function createYLabelGeoms (tickPositions, xCoords, scale, baseLineWidth, tickSize, labelOffset, flip) {
  const x = []
  const y = []

  const xStart = xCoords()[0]

  let offset = baseLineWidth + tickSize + labelOffset
  if (!flip) offset = -offset

  const bandOffset = scale.bandwidth ? scale.bandwidth() / 2 : 0

  for (let index = 0; index < tickPositions.length; index++) {
    const tick = scale(tickPositions[index]) + bandOffset
    x.push(xStart + offset)
    y.push(tick)
  }
  return { tickLabelXCoords: () => x, tickLabelYCoords: () => y }
}
