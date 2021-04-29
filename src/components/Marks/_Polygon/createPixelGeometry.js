import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

import propNeedsScaling from '../utils/propNeedsScaling.js'
import { createPixelGeometryFromXYArrays } from '../utils/createPixelGeometryFromXYArrays.js'
import { createPixelGeometryFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'

export default function createPixelGeometry (
  geometryProps,
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

    return createPixelGeometryFromXYArrays(
      { x, y },
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

    return createPixelGeometryFromGeometry(
      geometry,
      sectionContext,
      renderSettings,
      needsScaling
    )
  }
}
