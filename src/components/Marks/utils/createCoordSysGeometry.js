import { interpolateGeometry, transformGeometry } from '../../../utils/geometryUtils/index.js'

export function createCoordSysGeometry (
  geometry, coordinateTransformationContext, interpolate, visibilityTreshold = 1
) {
  if (transformationNecessary(coordinateTransformationContext)) {
    const transformFunc = coordinateTransformationContext.transform.bind(coordinateTransformationContext)

    if (interpolate) {
      return interpolateGeometry(geometry, transformFunc, visibilityTreshold)
    } else {
      return transformGeometry(geometry, transformFunc, visibilityTreshold)
    }
  } else {
    return geometry
  }
}

function transformationNecessary (coordinateTransformationContext) {
  return coordinateTransformationContext &&
  coordinateTransformationContext.type() !== 'identity'
}

export function createCoordSysGeometryObject (
  scaledGeometryArray, coordinateTransformationContext, keyArray, interpolate, visibilityTreshold = 1
) {
  const screenGeometryObject = {}

  for (let i = 0; i < scaledGeometryArray.length; i++) {
    const scaledGeometry = scaledGeometryArray[i]
    const screenGeometry = createCoordSysGeometry(
      scaledGeometry, coordinateTransformationContext, interpolate, visibilityTreshold
    )

    const key = keyArray[i]

    screenGeometryObject[key] = screenGeometry
  }

  return screenGeometryObject
}
