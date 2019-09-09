import { scaleGeometry } from '../../../utils/geometryUtils'
import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'
import { isDefined, isUndefined } from '../../../utils/equals.js'
import { createScaledGeometryFromXYProps, ensureValidCombination }
  from '../utils/createScaledGeometryFromXYProps.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  const scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  const coordSysGeometry = createCoordSysGeometry(scaledGeometry, coordinateTransformationContext)

  return coordSysGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps, 'Line')
  if (isDefined(geometryProps.geometry)) {
    if (geometryProps.geometry.constructor === Function) {
      return geometryProps.geometry(sectionContext)
    } else {
      return scaleGeometry(geometryProps.geometry, sectionContext)
    }
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryFromXYProps(geometryProps.x, geometryProps.y, sectionContext, 'Line')
  }
}
