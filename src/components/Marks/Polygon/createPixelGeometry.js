import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

import { createPixelGeometryFromXYArrays } from '../utils/createPixelGeometryFromXYArrays.js'
import { createPixelGeometryFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  coordinateTransformationContext,
  zoomTransformation,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)
  const inputType = getInputType(geometryProps)

  if (inputType === 'xy') {
    return createPixelGeometryFromXYArrays(
      geometryProps,
      sectionContext,
      coordinateTransformationContext,
      zoomTransformation,
      renderSettings,
      'Polygon'
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