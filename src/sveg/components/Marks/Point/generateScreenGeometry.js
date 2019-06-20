import { createScreenGeometry } from '../utils/createScreenGeometry.js'
import { scaleGeometry } from 'geometryUtils'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  let scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  let screenGeometry = createScreenGeometry(scaledGeometry, coordinateTransformationContext)

  return screenGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (geometryProps.geometry) {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }

  if (!geometryProps.geometry) {
    return createScaledGeometryFromCoordinates(geometryProps.x, geometryProps.y, sectionContext)
  }
}

function scaleGeometryProp (geometry, sectionContext) {
  let { scaleX, scaleY } = sectionContext.scales()
  return scaleGeometry(geometry, scaleX, scaleY)
}

export function ensureValidCombination (geometryProps) {
  if (geometryProps.geometry) {
    if (geometryProps.x || geometryProps.y) throw invalidCombinationError
  } else {
    if (!(geometryProps.x && geometryProps.y)) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Invalid combination of props 'x', 'y' and 'geometry'`)

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
