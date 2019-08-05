export function createXAxisCoords (vjust, y, rangeX, rangeY, offset, scaleX, scaleY) {
  // there are three ways of setting the position of the axis, in order of precedence
  // 1. vjust with 'bottom', 'center' or 'top'
  // 2. vjust with a number (relative position within content of section
  // 3. y prop with either a single number (positioning in data coords)
  //    or a function that returns an array of 2 numbers (in pixel coords)
  console.log(y)
  let xCoords
  let yCoords
  const x0 = rangeX[0]
  const x1 = rangeX[1]
  const y0 = rangeY[0]
  const y1 = rangeY[1]

  if (vjust === 'bottom') {
    xCoords = () => {
      return [x0, x1]
    }
    yCoords = () => {
      return [y0 + offset, y0 + offset]
    }
  }
  if (vjust === 'center') {
    xCoords = () => {
      return [x0, x1]
    }
    const yCoord = (y1 - y0) * 0.5 + y0
    yCoords = () => {
      return [yCoord + offset, yCoord + offset]
    }
  }
  if (vjust === 'top') {
    xCoords = () => {
      return [x0, x1]
    }
    yCoords = () => {
      return [y1 - offset, y1 - offset]
    }
  }
  if (!isNaN(vjust)) {
    xCoords = () => {
      return [x0, x1]
    }
    const yCoord = (y1 - y0) * vjust + y0
    yCoords = () => {
      return [yCoord, yCoord]
    }
  }
  if (!isNaN(y)) {
    xCoords = () => {
      return [x0, x1]
    }
    yCoords = () => [scaleY(y), scaleY(y)]
  }
  if (typeof y === 'function') {
    xCoords = () => {
      return [x0, x1]
    }
    yCoords = y
  }
  console.log(yCoords)
  return { xCoords, yCoords }
}

export function generateXTickGeoms (tickPositions, yCoords, tickSize) {
  const x = []
  const y = []
  let yStart
  let yFunction = true
  if (typeof yCoords === 'function') {
    yStart = yCoords()[0]
  } else {
    yStart = yCoords[0]
    yFunction = false
  }
  for (let index = 0; index < tickPositions.length; index++) {
    const tick = tickPositions[index]
    x.push([tick, tick])
    y.push([yStart, yStart + tickSize])
  }
  const yWrapper = (yFunction) ? () => y : y
  return { tickXCoords: x, tickYCoords: yWrapper }
}

export function generateXLabelGeoms (tickPositions, yCoords, tickSize, labelOffset) {
  const x = []
  const y = []
  let yStart
  let yFunction = true
  if (typeof yCoords === 'function') {
    yStart = yCoords()[0]
  } else {
    yStart = yCoords[0]
    yFunction = false
  }
  for (let index = 0; index < tickPositions.length; index++) {
    const tick = tickPositions[index]
    x.push(tick)
    y.push(yStart + tickSize + labelOffset)
  }
  const yWrapper = (yFunction) ? () => y : y
  return { tickLabelXCoords: x, tickLabelYCoords: yWrapper }
}
