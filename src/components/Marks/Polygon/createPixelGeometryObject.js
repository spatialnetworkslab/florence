import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

import { createPixelGeometryObjectFromXYArrays } from '../utils/createPixelGeometryFromXYArrays.js'
import { createPixelGeometryObjectFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'

export default function createPixelGeometry (
  geometryProps,
  keyProp,
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)
  const inputType = getInputType(geometryProps)

  if (inputType === 'xy') {
    return createPixelGeometryObjectFromXYArrays(
      geometryProps,
      keyProp,
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings,
      'Polygon'
    )
  }

  if (inputType === 'geometry') {
    return createPixelGeometryObjectFromGeometry(
      geometryProps,
      keyProp,
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings
    )
  }
}
