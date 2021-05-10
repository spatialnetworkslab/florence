export function getRectangleCoordinates ({ x1, x2, y1, y2 }) {
  const height = Math.abs(y2 - y1)
  const width = Math.abs(x2 - x1)

  if (width > height) {
    const centered = center(x1, x2, width, height)

    return {
      x1: ({ pxAt }) => pxAt(centered[0]),
      x2: ({ pxAt }) => pxAt(centered[1]),
      y1: ({ pyAt }) => pyAt(y1),
      y2: ({ pyAt }) => pyAt(y2)
    }
  }

  if (width <= height) {
    const centered = center(y1, y2, height, width)

    return {
      x1: ({ pxAt }) => pxAt(x1),
      x2: ({ pxAt }) => pxAt(x2),
      y1: ({ pyAt }) => pyAt(centered[0]),
      y2: ({ pyAt }) => pyAt(centered[1])
    }
  }
}

function center (lower, upper, bigWidth, smallWidth) {
  const space = (bigWidth - smallWidth) / 2
  return [space + lower, upper - space]
}
