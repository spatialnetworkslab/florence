export function getBaseLineCoordinatesXAxis (yAbsolute, sectionContext) {
  const { paddedBbox, finalScaleX, finalScaleY } = sectionContext
  const { minX: x1, maxX: x2 } = paddedBbox

  const x = [x1, x2].map(finalScaleX.invert)
  const y = [yAbsolute, yAbsolute].map(finalScaleY.invert)

  return {
    x: () => x,
    y: () => y
  }
}

export function getBaseLineCoordinatesYAxis (xAbsolute, sectionContext) {
  const { paddedBbox, finalScaleX, finalScaleY } = sectionContext
  const { minY: y1, maxY: y2 } = paddedBbox

  const x = [xAbsolute, xAbsolute].map(finalScaleX.invert)
  const y = [y1, y2].map(finalScaleY.invert)

  return {
    x: () => x,
    y: () => y
  }
}
