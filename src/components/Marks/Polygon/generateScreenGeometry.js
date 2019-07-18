import { createScreenGeometry } from '../utils/createScreenGeometry.js'
import { scaleGeometry } from 'geometryUtils'
import { isDefined, isUndefined } from 'equals.js'

export default function (
  geometryProps, sectionContext, coordinateTransformationContext, interpolate
) {
  const scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  const screenGeometry = createScreenGeometry(scaledGeometry, coordinateTransformationContext, interpolate)

  return screenGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)
  const scales = sectionContext.scales()

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometry(geometryProps.geometry, scales)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryFromCoordinateProps(geometryProps.x, geometryProps.y, scales)
  }
}

export function ensureValidCombination (geometryProps) {
  if (isDefined(geometryProps.geometry)) {
    if (isDefined(geometryProps.x) || isDefined(geometryProps.y)) throw invalidCombinationError
  } else {
    if (!(isDefined(geometryProps.x) && isDefined(geometryProps.y))) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Polygon: Invalid combination of 'x', 'y', and 'geometry' props`)

function createScaledGeometryFromCoordinateProps (x, y, scales) {
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

const noArrayError = new Error(`Polygon: 'x' and 'y' must evaluate to an Array`)

export function createGeometryFromScaledProps (x, y) {
  ensureCorrectLength(x, y)

  const outerRing = []

  for (let i = 0; i < x.length; i++) {
    outerRing.push([x[i], y[i]])
  }

  // Close the polygon
  outerRing.push([x[0], y[0]])

  return {
    type: 'Polygon',
    coordinates: [outerRing]
  }
}

function ensureCorrectLength (x, y) {
  if (x.length !== y.length) throw notSameLengthError
  if (x.length < 3) throw notEnoughPointsError
}

const notSameLengthError = new Error(`Polygon: 'x' and 'y' must have same length`)
const notEnoughPointsError = new Error('Polygon: must consist of at least 3 points')
