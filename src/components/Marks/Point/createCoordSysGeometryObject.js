import { createCoordSysGeometryObject } from '../utils/createCoordSysGeometry.js'
import { scaleGeometries } from '../../../utils/geometryUtils/index.js'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import getKeyArray from '../utils/getKeyArray.js'
import { ensureValidCombination } from './createCoordSysGeometry.js'
import { isDefined, isUndefined } from '../../../utils/equals.js'
import getNumberOfMarks from '../utils/getNumberOfMarks.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext, keyProp) {
  const { scaledGeometryArray, length } = createScaledGeometryArray(geometryProps, sectionContext)
  const keyArray = getKeyArray(keyProp, length)
  const coordSysGeometryObject = createCoordSysGeometryObject(
    scaledGeometryArray, coordinateTransformationContext, keyArray
  )

  return coordSysGeometryObject
}

function createScaledGeometryArray (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryArrayFromCoordinates(
      geometryProps.x, geometryProps.y, sectionContext
    )
  }
}

function scaleGeometryProp (geometry, sectionContext) {
  let scaledGeometryArray

  if (geometry.constructor === Function) {
    scaledGeometryArray = geometry(sectionContext)
  } else {
    scaledGeometryArray = scaleGeometries(geometry, sectionContext)
  }

  const length = scaledGeometryArray.length
  return { scaledGeometryArray, length }
}

function createScaledGeometryArrayFromCoordinates (x, y, sectionContext) {
  const xNeedsScaling = x.constructor !== Function
  const yNeedsScaling = y.constructor !== Function

  const xValue = x.constructor === Function ? x(sectionContext) : x
  const yValue = y.constructor === Function ? y(sectionContext) : y

  const length = getNumberOfMarks(xValue, yValue, 'Point')

  const xIsPrimitive = xValue.constructor !== Array
  const yIsPrimitive = yValue.constructor !== Array

  const scaledX = scaleCoordinate(xValue, sectionContext.scaleX, xNeedsScaling, xIsPrimitive, length)
  const scaledY = scaleCoordinate(yValue, sectionContext.scaleY, yNeedsScaling, yIsPrimitive, length)

  const scaledGeometryArray = createGeometryArrayFromScaledCoordinates(scaledX, scaledY, length)

  return { scaledGeometryArray, length }
}

function scaleCoordinate (c, scale, needsScaling, isPrimitive, length) {
  let array

  if (isPrimitive) array = generateArrayOfLength(c, length)
  if (!isPrimitive) array = c

  if (needsScaling) return array.map(scale)
  if (!needsScaling) return array
}

function createGeometryArrayFromScaledCoordinates (scaledX, scaledY, length) {
  const geometryArray = []

  for (let i = 0; i < length; i++) {
    geometryArray.push({
      type: 'Point',
      coordinates: [scaledX[i], scaledY[i]]
    })
  }

  return geometryArray
}
