import { createCoordSysGeometryObject } from '../utils/createCoordSysGeometry.js'
import { scaleGeometries } from '../../../utils/geometryUtils'
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

  return coordSysGeometryObject
}

function createScaledGeometryArray (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)
  if (isDefined(geometryProps.geometry)) {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryArrayFromXYProps(
      geometryProps.x, geometryProps.y, sectionContext, 'Line'
    )
  }
}

function scaleGeometryProp (geometry, scales) {
  const scaledGeometryArray = scaleGeometries(geometry, scales)
  const length = scaledGeometryArray.length

  return { scaledGeometryArray, length }
}
