export function getBaseLineCoordinatesXAxis (yAbs, { paddedBbox }) {
  const { minX, maxX } = paddedBbox

  return {
    x: ({ pxAt }) => [minX, maxX].map(pxAt),
    y: ({ pyAt }) => [yAbs, yAbs].map(pyAt)
  }
}

export function getBaseLineCoordinatesYAxis (xAbs, { paddedBbox }) {
  const { minY, maxY } = paddedBbox

  return {
    x: ({ pxAt }) => [xAbs, xAbs].map(pxAt),
    y: ({ pyAt }) => [minY, maxY].map(pyAt)
  }
}
