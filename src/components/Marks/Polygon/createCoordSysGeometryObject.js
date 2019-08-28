import { createCoordSysGeometryObject } from '../utils/createCoordSysGeometry.js'
import { scaleGeometries } from '../../../utils/geometryUtils'
import {
  ensureValidCombination, createScaledGeometryArrayFromXYProps
} from '../utils/createScaledGeometryFromXYProps.js'
import getKeyArray from '../utils/getKeyArray.js'
import { isDefined, isUndefined } from '../../../utils/equals.js'

export default function (
  geometryProps, sectionContext, coordinateTransformationContext, keyProp, interpolate
) {
  const { scaledGeometryArray, length } = createScaledGeometryArray(geometryProps, sectionContext)
  const keyArray = getKeyArray(keyProp, length)
  const coordSysGeometryObject = createCoordSysGeometryObject(
    scaledGeometryArray, coordinateTransformationContext, keyArray, interpolate
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
      geometryProps.x, geometryProps.y, sectionContext, 'Polygon'
    )
  }
}

function scaleGeometryProp (geometry, scales) {
  const scaledGeometryArray = scaleGeometries(geometry, scales)
  const length = scaledGeometryArray.length

  return { scaledGeometryArray, length }
}
