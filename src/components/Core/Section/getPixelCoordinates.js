import { scaleCoordinates } from '../../Marks/Rectangle/createPixelGeometry.js'

export function getPixelCoordinates (coordinates, sectionContext) {
  if (sectionContext.transformation) {
    throw new Error('Cannot nest coordinate transformations')
  }

  const scaledCoordinates = scaleCoordinates(coordinates, sectionContext)
  const finalCoordinates = getFinalCoordinates(scaledCoordinates, sectionContext)

  return finalCoordinates
}

function getFinalCoordinates ({ x1, x2, y1, y2 }, { finalScaleX, finalScaleY }) {
  return {
    x1: finalScaleX(x1),
    x2: finalScaleX(x2),
    y1: finalScaleY(y1),
    y2: finalScaleY(y2)
  }
}
