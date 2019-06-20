import { interpolateGeometry, transformGeometry } from 'geometryUtils'

export function createScreenGeometry (geometry, coordinateTransformationContext, interpolate, visibilityTreshold = 1) {
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

export function createScreenGeometryObject (scaledGeometryArray, coordinateTransformationContext, indexArray) {
  let screenGeometryObject = {}

  for (let i = 0; i < scaledGeometryArray.length; i++) {
    let scaledGeometry = scaledGeometryArray[i]
    let screenGeometry = createScreenGeometry(
      scaledGeometry, coordinateTransformationContext
    )

    let index = indexArray[i]

    screenGeometryObject[index] = screenGeometry
  }

  return screenGeometryObject
}
