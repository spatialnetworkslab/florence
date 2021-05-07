export function getBaseLineCoordinatesXAxis (yAbs) {
  return {
    x: () => [0, 1],
    y: ({ pyAt }) => [yAbs, yAbs].map(pyAt)
  }
}

export function getBaseLineCoordinatesYAxis (xAbs) {
  return {
    x: ({ pxAt }) => [xAbs, xAbs].map(pxAt),
    y: () => [0, 1]
  }
}
