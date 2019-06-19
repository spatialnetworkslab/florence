import * as interpolate from './interpolate.js'
import * as transform from './transform.js'

export default function (geometry, coordinateTransformationContext, interpolate, visibilityTreshold = 1) {
  let transformedGeometry

  if (transformationNecessary(coordinateTransformationContext)) {
    let transformFunc = coordinateTransformationContext.transform.bind(coordinateTransformationContext)

    if (interpolate) {
      transformedGeometry = interpolateGeometry(geometry, transformFunc, visibilityTreshold)
    }

    if (!interpolate) {
      transformedGeometry = transformGeometry(geometry, transformFunc, visibilityTreshold)
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

function interpolateGeometry (geometry, transformFunc, visibilityTreshold) {
  return interpolate[geometry.type](geometry, transformFunc, visibilityTreshold)
}

function transformGeometry (geometry, transformFunc, visibilityTreshold) {
  return transform[geometry.type](geometry, transformFunc, visibilityTreshold)
}
