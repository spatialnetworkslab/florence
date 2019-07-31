import { createCoordSysGeometryObject } from '../../../utils/geometryUtils/index.js'
import { scaleGeometries } from 'geometryUtils'
import {
  ensureValidCombination, createScaledGeometryArrayFromXYProps
} from '../utils/createScaledGeometryFromXYProps.js'
import getIndexArray from '../utils/getIndexArray.js'
import { isDefined, isUndefined } from '../../../utils/equals.js'

export default function (
  geometryProps, sectionContext, coordinateTransformationContext, indexProp, interpolate
) {
  const { scaledGeometryArray, length } = createScaledGeometryArray(geometryProps, sectionContext)
  const indexArray = getIndexArray(indexProp, length)
  const coordSysGeometryObject = createCoordSysGeometryObject(
    scaledGeometryArray, coordinateTransformationContext, indexArray, interpolate
  )

  return { coordSysGeometryObject, indexArray }
}

function createScaledGeometryArray (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)
  const scales = sectionContext.scales()

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometryProp(geometryProps.geometry, scales)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryArrayFromXYProps(
      geometryProps.x, geometryProps.y, scales, 'Polygon'
    )
  }
}

function scaleGeometryProp (geometry, scales) {
  const scaledGeometryArray = scaleGeometries(geometry, scales)
  const length = scaledGeometryArray.length

  return { scaledGeometryArray, length }
}
