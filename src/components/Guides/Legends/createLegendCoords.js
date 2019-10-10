// There are three ways of setting the position of the axis, in order of precedence
// 1. vjust with 'bottom', 'center' or 'top'
// 2. vjust with a number (relative position within content of section
// 3. y prop with either a single number (positioning in data coords)
//    or a function that returns an array of 2 numbers (in pixel coords)

export function createPosYCoords (vjust, yRange, orient, yOffset) {
  let yCoords
  let y1
  let y2

  const y1Range = yRange[0]
  const y2Range = yRange[1]
  const heightRatio = orient === 'vertical' ? 0.3 : 0.1
  yOffset = (yOffset === 0 || yOffset === undefined) ? (y2Range - y1Range) * heightRatio : yOffset

  yCoords = () => {
    return [y1Range, y2Range]
  }

  if (vjust === 'top') {
    yCoords = () => {
      return [y1Range, y1Range + yOffset]
    }
  }
  if (vjust === 'center') {
    const yCoord = (y2Range - y1Range) * 0.5 + y1Range
    yCoords = () => {
      return [yCoord - yOffset / 2, yCoord + yOffset / 2]
    }
  }
  if (vjust === 'bottom') {
    yCoords = () => {
      return [y2Range - yOffset, y2Range]
    }
  }

  if (!isNaN(vjust)) {
    const yCoord = (y2Range - y1Range) * vjust + y1Range
    yCoords = () => {
      return [yCoord, yCoord + yOffset]
    }
  }

  if (y1 === undefined && y2 === undefined) {
    y1 = yCoords()[0]
    y2 = yCoords()[1]
  }

  return { y1, y2 }
}

export function createPosXCoords (hjust, xRange, orient, xOffset) {
  let xCoords
  let x1
  let x2
  const x1Range = xRange[0]
  const x2Range = xRange[1]
  const widthRatio = orient === 'vertical' ? 0.1 : 0.3
  xOffset = xOffset === 0 ? (x2Range - x1Range) * widthRatio : xOffset

  if (hjust === 'left') {
    xCoords = () => {
      return [x1Range, x1Range + xOffset]
    }
  }
  if (hjust === 'center') {
    const xCoord = (x2Range - x1Range) * 0.5 + x1Range
    xCoords = () => {
      return [xCoord - xOffset / 2, xCoord + xOffset / 2]
    }
  }
  
  if (hjust === 'right') {
    xCoords = () => {
      return [x2Range - xOffset, x2Range]
    }
  }
  if (!isNaN(hjust)) {
    const xCoord = (x2Range - x1Range) * hjust + x1Range
    xCoords = () => {
      return [xCoord, xCoord + xOffset]
    }
  }

  if (x1 === undefined && x2 === undefined) {
    x1 = xCoords()[0]
    x2 = xCoords()[1]
  }

  return { x1, x2 }
}
