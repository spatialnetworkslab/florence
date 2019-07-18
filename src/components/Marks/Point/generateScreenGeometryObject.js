import { createScreenGeometryObject } from '../utils/createScreenGeometry.js'
import { scaleGeometries } from 'geometryUtils'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import getIndexArray from '../utils/getIndexArray.js'
import { ensureValidCombination } from './generateScreenGeometry.js'
import { isDefined, isUndefined } from 'equals.js'
import getNumberOfMarks from '../utils/getNumberOfMarks.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext, indexProp) {
  const { scaledGeometryArray, length } = createScaledGeometryArray(geometryProps, sectionContext)
  const indexArray = getIndexArray(indexProp, length)
  const screenGeometryObject = createScreenGeometryObject(scaledGeometryArray, coordinateTransformationContext, indexArray)

  return { screenGeometryObject, indexArray }
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
  const scaledGeometryArray = scaleGeometries(geometry, sectionContext.scales())
  const length = scaledGeometryArray.length

  return { scaledGeometryArray, length }
}

function createScaledGeometryArrayFromCoordinates (x, y, sectionContext) {
  const scales = sectionContext.scales()

  const xNeedsScaling = x.constructor !== Function
  const yNeedsScaling = y.constructor !== Function

  const xValue = x.constructor === Function ? x(scales) : x
  const yValue = y.constructor === Function ? y(scales) : y

  const length = getNumberOfPoints(xValue, yValue)

  const xIsPrimitive = xValue.constructor !== Array
  const yIsPrimitive = yValue.constructor !== Array

  const scaledX = scaleCoordinate(xValue, scales.scaleX, xNeedsScaling, xIsPrimitive, length)
  const scaledY = scaleCoordinate(yValue, scales.scaleY, yNeedsScaling, yIsPrimitive, length)

  const scaledGeometryArray = createGeometryArrayFromScaledCoordinates(scaledX, scaledY, length)

  return { scaledGeometryArray, length }
}

const getNumberOfPoints = getNumberOfMarks('PointLayer')

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
