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
    x: ({ pxAt }) => pxAt(x1),
    y: ({ pyAt }) => pyAt((y2 + y1) / 2)
  }
}

export function parseAesthetic (aesthetic, length) {
  if (aesthetic.constructor === Array) {
    if (aesthetic.length !== length) {
      throw new Error('Aesthetics and labels must all be of same length')
    }

    return aesthetic
  }

  return Array(length).fill(aesthetic)
}
