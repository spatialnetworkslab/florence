import { transformGeometry } from '../../../utils/geometryUtils/transformGeometry/index.js'

export function createPixelGeometryFromXYArrays (
  { x, y },
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  const xNeedsScaling = needsScaling(x)
  const yNeedsScaling = needsScaling(y)

  if (xNeedsScaling === false && yNeedsScaling === false) {

  } else if (xNeedsScaling === true && yNeedsScaling === true) {

  } else {

  }
}

export function createPixelGeometryFromGeometry (
  { geometry },
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {

}

function needsScaling (prop) {
  return prop.constructor === Array
}
