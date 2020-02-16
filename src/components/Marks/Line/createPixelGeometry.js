import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

import createPixelGeometryFromXYArrays from '../utils/createPixelGeometryFromXYArrays.js'
import createPixelGeometryFromGeometry from '../utils/createPixelGeometryFromGeometry.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  coordinateTransformationContext,
  zoomTransformation,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)
  const inputType = getInputType(geometryProps)

  if (inputType === 'xyArrays') {
    return createPixelGeometryFromXYArrays(
      geometryProps,
      sectionContext,
      coordinateTransformationContext,
      zoomTransformation,
      renderSettings,
      'LineString'
    )
  }

  if (inputType === 'geometry') {
    return createPixelGeometryFromGeometry(
      geometryProps,
      sectionContext,
      coordinateTransformationContext,
      zoomTransformation,
      renderSettings
    )
  }
}
