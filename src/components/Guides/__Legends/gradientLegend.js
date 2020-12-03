export function generateStopOffsets (numberOfColors) {
  if (numberOfColors < 2) throw new Error('At least 2 colors needed for gradient')

  const increment = 100 / (numberOfColors - 1)
  const offsets = []

  for (let i = 0; i < numberOfColors; i++) {
    offsets.push(`${Math.floor(i * increment)}%`)
  }

  return offsets
}

export function getRectangleCoordinates (
  xDivider, yDivider, rectangleWidth, numberOfLabels
) {
  const xSpace = (xDivider - rectangleWidth) / 2
  const ySpace = (1 - yDivider) / (numberOfLabels * 2)

  return {
    x1: xSpace,
    x2: rectangleWidth + xSpace,
    y1: yDivider + ySpace,
    y2: 1 - ySpace
  }
}
