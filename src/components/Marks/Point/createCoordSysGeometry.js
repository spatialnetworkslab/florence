import { scaleGeometry } from '../../../utils/geometryUtils/index.js'
import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'
import { isDefined, isUndefined } from '../../../utils/equals.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  const scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  const coordSysGeometry = createCoordSysGeometry(scaledGeometry, coordinateTransformationContext)

  return coordSysGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryFromCoordinates(geometryProps.x, geometryProps.y, sectionContext)
  }
}

function scaleGeometryProp (geometry, sectionContext) {
  return scaleGeometry(geometry, sectionContext.scales())
}

export function ensureValidCombination (geometryProps) {
  if (isDefined(geometryProps.geometry)) {
    if (isDefined(geometryProps.x) || isDefined(geometryProps.y)) throw invalidCombinationError
  } else {
    if (!(isDefined(geometryProps.x) && isDefined(geometryProps.y))) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Point: invalid combination of props 'x', 'y' and 'geometry'`)

function createScaledGeometryFromCoordinates (x, y, sectionContext) {
  const scales = sectionContext.scales()
  const { scaleX, scaleY } = scales

  const scaledX = x.constructor === Function ? x(scales) : scaleX(x)
  const scaledY = y.constructor === Function ? y(scales) : scaleY(y)

  return {
    type: 'Point',
    coordinates: [scaledX, scaledY]
  }
}
