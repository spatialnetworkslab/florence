import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

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

  }

  if (inputType === 'geometry') {

  }
}
