export function parseHJust (hjust, xOffset, bbox) {
  const { minX: x1, maxX: x2 } = bbox

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

export function parseVJust (vjust, yOffset, bbox) {
  const { minY: y1, maxY: y2 } = bbox

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
