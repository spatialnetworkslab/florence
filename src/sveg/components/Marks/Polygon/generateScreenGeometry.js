import { createScreenGeometry } from '../utils/createScreenGeometry.js'
import { scaleGeometry } from 'geometryUtils'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import { isDefined, isUndefined } from 'equals.js'

export default function (
  geometryProps, sectionContext, coordinateTransformationContext, interpolate
) {
  let scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  let screenGeometry = createScreenGeometry(scaledGeometry, coordinateTransformationContext, interpolate)

  return screenGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometry(geometryProps.geometry, sectionContext.scales())
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryFromCoordinateProps(geometryProps.x, geometryProps.y, sectionContext)
  }
}

function ensureValidCombination (coordinateProps) {
  if (isDefined(coordinateProps.geometry)) {
    if (isDefined(coordinateProps.x) || isDefined(coordinateProps.y)) throw invalidCombinationError
  } else {
    if (!(isDefined(coordinateProps.x) && isDefined(coordinateProps.y))) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Polygon: Invalid combination of 'x', 'y', and 'geometry' props`)

function createScaledGeometryFromCoordinateProps (x, y, sectionContext) {
  let coordinates = []
  let scales = sectionContext.scales()
  let length = getLength(x, y, scales)

  let scaledX = getValueX(x, scales, length)
  let scaledY = getValueY(y, scales, length)

  ensureSameLength(scaledX, scaledY)

  for (let i = 0; i < scaledX.length; i++) {
    coordinates.push([scaledX[i], scaledY[i]])
  }

  return {
    type: 'Polygon',
    coordinates
  }
}

function makeValueGetter (scaleName) {
  return function getValue (coordinateProp, scales, length) {
    let scale = scales[scaleName]

    if (coordinateProp.constructor === Function) {
      return handleFunctionProp(coordinateProp, scales, length)
    } else {
      return handleOtherProp(coordinateProp, scale, length)
    }
  }
}

function handleFunctionProp (coordinateProp, scales, length) {
  let value = coordinateProp(scales)
  if (value.constructor === Array) {
    return value
  } else {
    return generateArrayOfLength(value, length)
  }
}

function handleOtherProp (coordinateProp, scale, length) {
  if (coordinateProp.constructor === Array) {
    return coordinateProp.map(scale)
  } else {
    return generateArrayOfLength(coordinateProp, length)
  }
}

const getValueX = makeValueGetter('scaleX')
const getValueY = makeValueGetter('scaleY')

function getLength (x, y, scales) {
  if (x.constructor === Array || y.constructor === Array) {
    return x.constructor === Array ? x.length : y.length
  }

  if (x.constructor === Function || y.constructor === Function) {
    if (x.constructor === Function) {
      let xValue = x(scales)
      if (xValue.constructor === Array) return xValue.length
    }

    if (y.constructor === Function) {
      let yValue = y(scales)
      if (yValue.constructor === Array) return yValue.length
    }
  }

  throw noArrayError
}

const noArrayError = new Error(`Polygon: at least 'x' or 'y' must evaluate to an Array`)

function ensureSameLength (x, y) {
  if (x.length !== y.length) throw invalidLengthError
}

const invalidLengthError = new Error(`Polygon: 'x' and 'y' must have same length`)
