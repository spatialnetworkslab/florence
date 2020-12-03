export function getSectionCoordinates (x1, x2, y1, y2) {
  return {
    x1: Math.min(x1, x2),
    x2: Math.max(x1, x2),
    y1: Math.min(y1, y2),
    y2: Math.max(y1, y2)
  }
}

export function getRectangleCoordinates ({ x1, x2, y1, y2 }) {
  const height = Math.abs(y2 - y1)
  const width = Math.abs(x2 - x1)

  if (width > height) {
    const centered = center(x1, x2, width, height)

    return {
      x1: centered[0],
      x2: centered[1],
      y1,
      y2
    }
  }

  if (width <= height) {
    const centered = center(y1, y2, height, width)

    return {
      x1,
      x2,
      y1: centered[0],
      y2: centered[1]
    }
  }
}

function center (lower, upper, bigWidth, smallWidth) {
  const space = (bigWidth - smallWidth) / 2
  return [space + lower, upper - space]
}

export function getLabelCoordinates ({ x1, x2, y1, y2 }) {
  return {
    x: x1,
    y: (y2 + y1) / 2
  }
}
