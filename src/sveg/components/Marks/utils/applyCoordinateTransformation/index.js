import * as interpolate from './interpolate.js'
import * as transform from './transform.js'

export default function (
  geometry, geometryType, coordinateTransformationContext, interpolate, visibilityTreshold = 1
) {
  let transformedGeometry

  if (transformationNecessary(coordinateTransformationContext)) {
    let transformFunc = coordinateTransformationContext.transform.bind(coordinateTransformationContext)

    if (interpolate) {
      transformedGeometry = interpolateGeometry(geometry, geometryType, transformFunc, visibilityTreshold)
    }

    if (!interpolate) {
      transformedGeometry = transformGeometry(geometry, geometryType, transformFunc, visibilityTreshold)
    }
  }

  if (!transformationNecessary(coordinateTransformationContext)) {
    transformedGeometry = geometry
  }

  return transformedGeometry
}

function transformationNecessary (coordinateTransformationContext) {
  return coordinateTransformationContext &&
  coordinateTransformationContext.type() !== 'identity'
}

function interpolateGeometry (geometry, geometryType, transformFunc, visibilityTreshold) {
  return interpolate[geometryType](geometry, transformFunc, visibilityTreshold)
}

function transformGeometry (coordinates, geometryType, transformFunc, visibilityTreshold) {
  return transform[geometryType](coordinates, transformFunc, visibilityTreshold)
}
