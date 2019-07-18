import * as interpolate from './interpolate.js'
import * as transform from './transform.js'

export default function (
  coordinates, coordinateTransformationContext, interpolate, visibilityTreshold = 1
) {
  let transformedCoordinates

  if (transformationNecessary(coordinateTransformationContext)) {
    const transformFunc = coordinateTransformationContext.transform.bind(coordinateTransformationContext)

    if (interpolate) {
      transformedCoordinates = interpolateCoordinates(coordinates, transformFunc, visibilityTreshold)
    }

    if (!interpolate) {
      transformedCoordinates = transformCoordinates(coordinates, transformFunc, visibilityTreshold)
    }
  }

  if (!transformationNecessary(coordinateTransformationContext)) {
    transformedCoordinates = coordinates
  }

  return transformedCoordinates
}

function transformationNecessary (coordinateTransformationContext) {
  return coordinateTransformationContext &&
  coordinateTransformationContext.type() !== 'identity'
}

function interpolateCoordinates (coordinates, transformFunc, visibilityTreshold) {
  const geometryType = detectGeometryType(coordinates)

  return interpolate[geometryType](coordinates, transformFunc, visibilityTreshold)
}

function transformCoordinates (coordinates, transformFunc, visibilityTreshold) {
  const geometryType = detectGeometryType(coordinates)

  return transform[geometryType](coordinates, transformFunc, visibilityTreshold)
}

function detectGeometryType (coordinates) {
  if (isPoint(coordinates)) {
    return 'point'
  }

  if (isPointArray(coordinates)) {
    return 'pointArray'
  }

  throw new Error(`Unknown geometry type: ${JSON.stringify(coordinates)}`)
}

function isPoint (coordinates) {
  if (coordinates.constructor === Array && coordinates.length === 2) {
    return coordinates[0].constructor === Number &&
      coordinates[1].constructor === Number
  }
}

function isPointArray (coordinates) {
  if (coordinates.constructor !== Array) return false

  for (let i = 0; i < coordinates.length; i++) {
    const entry = coordinates[i]
    if (!isPoint(entry)) return false
  }

  return true
}
