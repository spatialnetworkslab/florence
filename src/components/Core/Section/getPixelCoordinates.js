import { scaleCoordinates } from '../../Marks/Rectangle/createPixelGeometry.js'

export function getPixelCoordinates (coordinates, sectionContext) {
  if (sectionContext.transformation) {
    throw new Error('Cannot nest coordinate transformations')
  }

  const scaledCoordinates = scaleCoordinates(coordinates, sectionContext)
  const finalCoordinates = getFinalCoordinates(scaledCoordinates, sectionContext)

  return finalCoordinates
}

function getFinalCoordinates ({ x1, x2, y1, y2 }, { padding, zoomIdentity }) {
  const { left, right, top, bottom } = padding

  if (zoomIdentity) {
    const { x, y, kx, ky } = zoomIdentity

    return {
      x1: (x1 + left) * kx + x,
      x2: (x2 - right) * kx + x,
      y1: (y1 + top) * ky + y,
      y2: (y2 - bottom) * ky + y
    }
  }

  if (!zoomIdentity) {
    return {
      x1: x1 + left,
      x2: x2 - right,
      y1: y1 + top,
      y2: y2 - bottom
    }
  }
}
