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

export function ensureValidCombination (geometryProps) {
  if (isDefined(geometryProps.geometry)) {
    if (isDefined(geometryProps.x) || isDefined(geometryProps.y)) throw invalidCombinationError
  } else {
    if (!(isDefined(geometryProps.x) && isDefined(geometryProps.y))) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error('Invalid combination of props \'x\', \'y\' and \'geometry\'')

function scaleGeometryProp (geometry, sectionContext) {
  if (geometry.constructor === Function) {
    return geometry(sectionContext)
  } else {
    return scaleGeometry(geometry, sectionContext)
  }
}

function createScaledGeometryFromCoordinates (x, y, sectionContext) {
  const { scaleX, scaleY } = sectionContext

  const scaledX = x.constructor === Function ? x(sectionContext) : scaleX(x)
  const scaledY = y.constructor === Function ? y(sectionContext) : scaleY(y)

  return {
    type: 'Point',
    coordinates: [scaledX, scaledY]
  }
}