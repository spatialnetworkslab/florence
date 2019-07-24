import { scaleGeometry } from 'geometryUtils'
import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'
import { isDefined, isUndefined } from 'equals.js'

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
    return createScaledGeometryFromCoordinateProps(geometryProps.x, geometryProps.y, sectionContext)
  }
}

export function ensureValidCombination (geometryProps) {
  if (isDefined(geometryProps.geometry)) {
    if (isDefined(geometryProps.x) || isDefined(geometryProps.y)) throw invalidCombinationError
  } else {
    if (!(isDefined(geometryProps.x) && isDefined(geometryProps.y))) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Point: invalid combination of props 'x', 'y' and 'geometry'`)

function scaleGeometryProp (geometry, sectionContext) {
  return scaleGeometry(geometry, sectionContext.scales())
}

function createScaledGeometryFromCoordinateProps (x, y, sectionContext) {
  const scales = sectionContext.scales()
  const scaledX = getValueX(x, scales)
  const scaledY = getValueY(y, scales)

  return createGeometryFromScaledProps(scaledX, scaledY)
}

function makeValueGetter (scaleName) {
  return function getValue (coordinateProp, scales, length) {
    const scale = scales[scaleName]

    if (coordinateProp.constructor === Function) {
      return handleFunctionProp(coordinateProp, scales, length)
    } else {
      return handleOtherProp(coordinateProp, scale, length)
    }
  }
}

const getValueX = makeValueGetter('scaleX')
const getValueY = makeValueGetter('scaleY')

function handleFunctionProp (coordinateProp, scales) {
  const value = coordinateProp(scales)
  if (value.constructor === Array) return value

  throw noArrayError
}

function handleOtherProp (coordinateProp, scale, length) {

  if (coordinateProp.constructor === Array) return coordinateProp.map(scale)

  throw noArrayError
}

const noArrayError = new Error(`Line: 'x' and 'y' must evaluate to an Array`)

export function createGeometryFromScaledProps (x, y) {
  ensureCorrectLength(x, y)

  const lineStringCoordinates = []

  for (let i = 0; i < x.length; i++) {
    lineStringCoordinates.push([x[i], y[i]])
  }

  return {
    type: 'LineString',
    coordinates: lineStringCoordinates
  }
}

function ensureCorrectLength (x, y) {
  if (x.length !== y.length) throw notSameLengthError
  if (x.length < 2) throw notEnoughPointsError
}

const notSameLengthError = new Error(`Line: 'x' and 'y' must have same length`)
const notEnoughPointsError = new Error('Line: must consist of at least 2 points')
