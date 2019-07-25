import { linearRingIsClockwise } from 'geometryUtils'
import { isDefined } from 'equals.js'
import getNumberOfMarks from './getNumberOfMarks.js'

export function createScaledGeometryFromXYProps (x, y, scales, markType) {
  const scaledX = getValueX(x, scales, markType)
  const scaledY = getValueY(y, scales, markType)

  return createGeometryFromScaledProps(scaledX, scaledY, markType)
}

function makeValueGetter (scaleName) {
  return function getValue (coordinateProp, scales) {
    const scale = scales[scaleName]

    if (coordinateProp.constructor === Function) {
      return handleFunctionProp(coordinateProp, scales)
    } else {
      return handleOtherProp(coordinateProp, scale)
    }
  }
}

const getValueX = makeValueGetter('scaleX')
const getValueY = makeValueGetter('scaleY')

function handleFunctionProp (coordinateProp, scales, markType) {
  const value = coordinateProp(scales)
  if (value.constructor === Array) return value

  throw noArrayError(markType)
}

function handleOtherProp (coordinateProp, scale, markType) {
  if (coordinateProp.constructor === Array) return coordinateProp.map(scale)

  throw noArrayError(markType)
}

const noArrayError = markType => new Error(`${markType}: 'x' and 'y' must evaluate to an Array`)

export function createGeometryFromScaledProps (x, y, markType) {
  ensureCorrectLength(x, y, markType)

  const coordinates = []

  for (let i = 0; i < x.length; i++) {
    coordinates.push([x[i], y[i]])
  }

  if (markType === 'Polygon') {
    return createPolygon(coordinates)
  }

  if (markType === 'Line') {
    return createLineString(coordinates)
  }
}

function ensureCorrectLength (x, y, markType) {
  if (x.length !== y.length) throw notSameLengthError(markType)
  if (markType === 'Polygon' && x.length < 3) throw notEnoughPointsError(markType, 3)
  if (markType === 'Line' && x.length < 2) throw notEnoughPointsError(markType, 2)
}

const notSameLengthError = markType => new Error(`${markType}: 'x' and 'y' must have same length`)
const notEnoughPointsError = (markType, numberOfPoints) => {
  return new Error(`${markType}: must consist of at least ${numberOfPoints} points`)
}

function createPolygon (coordinates) {
  // To adhere to the GeoJSON spec, outer rings must always be closed
  if (isNotClosed(coordinates)) {
    const firstPosition = coordinates[0]
    coordinates.push([firstPosition[0], firstPosition[1]])
  }

  // To adhere to the GeoJSON spec, outer rings must always be counter-clockwise
  if (linearRingIsClockwise(coordinates)) {
    coordinates.reverse()
  }

  return {
    type: 'Polygon',
    coordinates: [coordinates]
  }
}

function createLineString (coordinates) {
  return {
    type: 'LineString',
    coordinates
  }
}

function isNotClosed (ring) {
  const first = ring[0]
  const last = ring[ring.length - 1]

  return first[0] !== last[0] || first[1] !== last[1]
}

export function ensureValidCombination (geometryProps, markType) {
  if (isDefined(geometryProps.geometry)) {
    if (isDefined(geometryProps.x) || isDefined(geometryProps.y)) throw invalidCombinationError(markType)
  } else {
    if (!(isDefined(geometryProps.x) && isDefined(geometryProps.y))) throw invalidCombinationError(markType)
  }
}

const invalidCombinationError = mark => new Error(`${mark}: Invalid combination of 'x', 'y', and 'geometry' props`)

export function createScaledGeometryArrayFromXYProps (x, y, scales, markType) {
  const { scaleX, scaleY } = scales

  const xNeedsScaling = x.constructor !== Function
  const yNeedsScaling = y.constructor !== Function

  const xValues = xNeedsScaling ? x : x(scales)
  const yValues = yNeedsScaling ? y : y(scales)

  const length = getNumberOfMarks(xValues, yValues, markType)

  const scaledGeometryArray = []

  for (let i = 0; i < xValues.length; i++) {
    const scaledX = xNeedsScaling ? x[i].map(scaleX) : xValues[i]
    const scaledY = yNeedsScaling ? y[i].map(scaleY) : yValues[i]

    const scaledGeometry = createGeometryFromScaledProps(scaledX, scaledY)
    scaledGeometryArray.push(scaledGeometry)
  }

  return { scaledGeometryArray, length }
}
