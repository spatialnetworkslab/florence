export function createPosYCoords (hjust, offset, scaleX, scaleY, sectionContext) {
  // there are three ways of setting the position of the axis, in order of precedence
  // 1. vjust with 'bottom', 'center' or 'top'
  // 2. vjust with a number (relative position within content of section
  // 3. y prop with either a single number (positioning in data coords)
  //    or a function that returns an array of 2 numbers (in pixel coords)
  console.log(scaleX, scaleY)
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
  console.log(yCoords)
  return { xCoords, yCoords }
}