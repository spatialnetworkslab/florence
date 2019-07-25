import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'
import { scaleGeometry } from 'geometryUtils'
import { isDefined, isUndefined } from 'equals.js'
import { createScaledGeometryFromXYProps, ensureValidCombination }
  from '../utils/createScaledGeometryFromXYProps.js'

export default function (
  geometryProps, sectionContext, coordinateTransformationContext, interpolate
) {
  const scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  const coordSysGeometry = createCoordSysGeometry(scaledGeometry, coordinateTransformationContext, interpolate)

  return coordSysGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps, 'Polygon')
  const scales = sectionContext.scales()

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometry(geometryProps.geometry, scales)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryFromXYProps(geometryProps.x, geometryProps.y, scales, 'Polygon')
  }
}
