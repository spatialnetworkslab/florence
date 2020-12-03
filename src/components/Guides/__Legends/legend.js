export function getSectionCoordinates (x1, x2, y1, y2) {
  return {
    x1: Math.min(x1, x2),
    x2: Math.max(x1, x2),
    y1: Math.min(y1, y2),
    y2: Math.max(y1, y2)
  }
}

export function getLabelCoordinates ({ x1, x2, y1, y2 }) {
  return {
    x: x1,
    y: (y2 + y1) / 2
  }
}
