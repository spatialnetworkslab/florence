import { interpolateGeometry, transformGeometry } from 'geometryUtils'

export default function (geometry, coordinateTransformationContext, interpolate, visibilityTreshold = 1) {
  if (transformationNecessary(coordinateTransformationContext)) {
    let transformFunc = coordinateTransformationContext.transform.bind(coordinateTransformationContext)

    if (interpolate) {
      return interpolateGeometry(geometry, transformFunc, visibilityTreshold)
    }

    if (!interpolate) {
      return transformGeometry(geometry, transformFunc, visibilityTreshold)
    }
  }

  if (!transformationNecessary(coordinateTransformationContext)) {
    return geometry
  }
}

function transformationNecessary (coordinateTransformationContext) {
  return coordinateTransformationContext &&
  coordinateTransformationContext.type() !== 'identity'
}
