import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'
import {
  createPixelGeometryFromXYArrays,
  createPixelGeometryFromGeometry
} from '../utils/createPixelGeometry.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)
  const inputType = getInputType(geometryProps)

  if (inputType === 'xyArrays') {
    return createPixelGeometryFromXYArrays(
      geometryProps,
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings
    )
  }

  if (inputType === 'geometry') {
    return createPixelGeometryFromGeometry(
      geometryProps,
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings
    )
  }
}
