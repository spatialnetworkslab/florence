export function getBaseLineCoordinatesXAxis (yAbsolute, sectionContext) {
  const { paddedBbox, indirectScales } = sectionContext
  const { minX: x1, maxX: x2 } = paddedBbox

  const x = [x1, x2].map(indirectScales.x.invert)
  const y = [yAbsolute, yAbsolute].map(indirectScales.y.invert)

  return {
    x: () => x,
    y: () => y
  }
}

export function getBaseLineCoordinatesYAxis (xAbsolute, sectionContext) {
  const { paddedBbox, indirectScales } = sectionContext
  const { minY: y1, maxY: y2 } = paddedBbox

  const x = [xAbsolute, xAbsolute].map(indirectScales.x.invert)
  const y = [y1, y2].map(indirectScales.y.invert)

  return {
    x: () => x,
    y: () => y
  }
}
