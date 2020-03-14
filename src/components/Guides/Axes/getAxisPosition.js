export function getPositionXAxis (vjust, yOffset, { paddedBbox }) {
  const { y1, y2 } = paddedBbox

  if (vjust === 'top') {
    return y1 - yOffset
  }

  if (vjust === 'bottom') {
    return y2 + yOffset
  }

  if (['center', 'centre'].includes(vjust)) {
    return (y2 - y1) / 2 + y1 + yOffset
  }

  if (vjust.constructor === Number) {
    return (y2 - y1) * vjust + y1
  }
}

export function getPositionYAxis (hjust, xOffset, { paddedBbox }) {
  const { x1, x2 } = paddedBbox

  if (hjust === 'left') {
    return x1 - xOffset
  }

  if (hjust === 'right') {
    return x2 + xOffset
  }

  if (['center', 'centre'].includes(hjust)) {
    return (x2 - x1) / 2 + x1 + xOffset
  }

  if (hjust.constructor === Number) {
    return (x2 - x1) * hjust + x1
  }
}
