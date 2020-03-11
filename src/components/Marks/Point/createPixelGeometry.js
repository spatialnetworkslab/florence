import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'
import propNeedsScaling from '../utils/propNeedsScaling.js'
import { transformGeometry } from '../../../utils/geometryUtils/index.js'

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

    const y = xNeedsScaling
      ? geometryProps.y
      : geometryProps.y(sectionContext)

    const totalTransformation = sectionContext.getTotalTransformation({ xNeedsScaling, yNeedsScaling })

    return transformGeometry({ type: 'Point', x, y }, totalTransformation, renderSettings)
  }

  if (inputType === 'geometry') {
    const needsScaling = propNeedsScaling(geometryProps.geometry)

    const geometry = needsScaling
      ? geometryProps.geometry
      : geometryProps.geometry(sectionContext)

    const totalTransformation = sectionContext.getTotalTransformation(needsScaling)

    return transformGeometry(geometry, totalTransformation, renderSettings)
  }
}
