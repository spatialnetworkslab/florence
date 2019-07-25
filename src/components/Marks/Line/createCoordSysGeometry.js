import { scaleGeometry } from 'geometryUtils'
import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'
import { isDefined, isUndefined } from 'equals.js'
import createScaledGeometryFromXYProps, { ensureValidCombination }
  from '../utils/createScaledGeometryFromXYProps.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  const scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  const coordSysGeometry = createCoordSysGeometry(scaledGeometry, coordinateTransformationContext)

  return coordSysGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps, 'Line')
  const scales = sectionContext.scales()

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometry(geometryProps.geometry, scales)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryFromXYProps(geometryProps.x, geometryProps.y, scales, 'Line')
  }
}
