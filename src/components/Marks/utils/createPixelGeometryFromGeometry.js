import getTotalTransformation from './getTotalTransformation.js'
import { transformGeometry } from '../../../utils/geometryUtils/transformGeometry/index.js'
import { isDefined } from '../../../utils/equals.js'

const needsScaling = prop => prop.constructor === Array
const geometryNeedsToBeTransformed = totalTransformation => isDefined(totalTransformation)

export default function createPixelGeometryFromGeometry (
  { geometry },
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  const geometryNeedsScaling = needsScaling(geometry)

  const totalTransformation = getTotalTransformation({
    sectionContext,
    xNeedsScaling: geometryNeedsScaling,
    yNeedsScaling: geometryNeedsScaling,
    coordinateTransformationContext,
    zoomContext
  })

  return geometryNeedsToBeTransformed(totalTransformation)
    ? transformGeometry(geometry, totalTransformation, renderSettings)
    : geometry
}
