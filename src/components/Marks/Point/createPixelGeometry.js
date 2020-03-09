import {
  ensureValidGeometryProps,
  getInputType
} from '../utils/geometryPropTools.js'

import getTotalTransformation, { createScaleTransformation } from '../utils/getTotalTransformation.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)

  const scaledGeometry = createScaledGeometry(geometryProps, sectionContext)

  const transformation = getTotalTransformation({
    xNeedsScaling: false,
    yNeedsScaling: false,
    coordinateTransformationContext,
    zoomContext
  })

  return transformation
    ? transformPointGeometry(scaledGeometry, transformation)
    : scaledGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  const inputType = getInputType(geometryProps)

  if (inputType === 'xy') {
    return createScaledGeometryFromCoordinates(geometryProps.x, geometryProps.y, sectionContext)
  }

  if (inputType === 'geometry') {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }
}

function createScaledGeometryFromCoordinates (x, y, sectionContext) {
  const { scaleX, scaleY } = sectionContext

  const scaledX = x.constructor === Function ? x(sectionContext) : scaleX(x)
  const scaledY = y.constructor === Function ? y(sectionContext) : scaleY(y)

  return {
    type: 'Point',
    coordinates: [scaledX, scaledY]
  }
}

function scaleGeometryProp (geometry, sectionContext) {
  if (geometry.constructor === Function) {
    return geometry(sectionContext)
  } else {
    const scaleTransformation = createScaleTransformation(
      sectionContext.scaleX,
      sectionContext.scaleY
    )

    return transformPointGeometry(geometry, scaleTransformation)
  }
}

function transformPointGeometry (point, transformation) {
  return {
    type: 'Point',
    coordinates: transformation(point.coordinates)
  }
}
