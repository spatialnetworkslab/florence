import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

import propNeedsScaling from '../utils/propNeedsScaling.js'
import { createPixelGeometryObjectFromXYArrays } from '../utils/createPixelGeometryFromXYArrays.js'
import { createPixelGeometryObjectFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'

export default function createPixelGeometry (
  geometryProps,
  keyProp,
  sectionContext,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)
  const inputType = getInputType(geometryProps)

  if (inputType === 'xy') {
    const xNeedsScaling = propNeedsScaling(geometryProps.x)
    const yNeedsScaling = propNeedsScaling(geometryProps.y)

    const x = xNeedsScaling
      ? geometryProps.x
      : geometryProps.x(sectionContext)

    const y = yNeedsScaling
      ? geometryProps.y
      : geometryProps.y(sectionContext)

    return createPixelGeometryObjectFromXYArrays(
      { x, y },
      keyProp,
      sectionContext,
      renderSettings,
      'Polygon',
      { xNeedsScaling, yNeedsScaling }
    )
  }

  if (inputType === 'geometry') {
    const needsScaling = propNeedsScaling(geometryProps.geometry)

    const geometry = needsScaling
      ? geometryProps.geometry
      : geometryProps.geometry(sectionContext)

    return createPixelGeometryObjectFromGeometry(
      geometry,
      keyProp,
      sectionContext,
      renderSettings,
      needsScaling
    )
  }
}
