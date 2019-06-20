import { createScreenGeometryObject } from '../utils/createScreenGeometry.js'
import { scaleGeometries } from 'geometryUtils'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import getIndexArray from '../utils/getIndexArray.js'
import { ensureValidCombination } from './generateScreenGeometry.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext, indexProp) {
  let { scaledGeometryArray, length } = createScaledGeometryArray(geometryProps, sectionContext)

  let indexArray = getIndexArray(indexProp, length)

  let screenGeometryObject = createScreenGeometryObject(scaledGeometryArray, coordinateTransformationContext, indexArray)

  return { screenGeometryObject, indexArray }
}

function createScaledGeometryArray (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (geometryProps.geometry) {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }

  if (!geometryProps.geometry) {
    return createScaledGeometryArrayFromCoordinates(
      geometryProps.x, geometryProps.y, sectionContext
    )
  }
}

function scaleGeometryProp (geometry, sectionContext) {
  let { scaleX, scaleY } = sectionContext.scales()
  let scaledGeometryArray = scaleGeometries(geometry, scaleX, scaleY)
  let length = scaledGeometryArray.length

  return { scaledGeometryArray, length }
}

function createScaledGeometryArrayFromCoordinates (x, y, sectionContext) {
  const scales = sectionContext.scales()

  let xNeedsScaling = x.constructor !== Function
  let yNeedsScaling = y.constructor !== Function

  let xValue = x.constructor === Function ? x(scales) : x
  let yValue = y.constructor === Function ? y(scales) : y

  let length = getNPoints(xValue, yValue)

  let xIsPrimitive = xValue.constructor !== Array
  let yIsPrimitive = yValue.constructor !== Array

  let scaledX = scaleCoordinate(xValue, scales.scaleX, xNeedsScaling, xIsPrimitive, length)
  let scaledY = scaleCoordinate(yValue, scales.scaleY, yNeedsScaling, yIsPrimitive, length)

  let scaledGeometryArray = createGeometryArrayFromScaledCoordinates(scaledX, scaledY, length)

  return { scaledGeometryArray, length }
}

function getNPoints (x, y) {
  if (x.constructor !== Array && y.constructor !== Array) {
    throw new Error(`PointLayer: at least 'x' or 'y' must evaluate to an Array`)
  }

  let length = x.constructor === Array ? x.length : y.length

  if (x.constructor === Array && y.constructor === Array) {
    if (x.length !== length || y.length !== length) {
      throw new Error(`PointLayer: 'x' and 'y' have different lengths`)
    }
  }

  return length
}

function scaleCoordinate (c, scale, needsScaling, isPrimitive, length) {
  let array

  if (isPrimitive) array = generateArrayOfLength(c, length)
  if (!isPrimitive) array = c

  if (needsScaling) return array.map(scale)
  if (!needsScaling) return array
}

function createGeometryArrayFromScaledCoordinates (scaledX, scaledY, length) {
  let geometryArray = []

  for (let i = 0; i < length; i++) {
    geometryArray.push({
      type: 'Point',
      coordinates: [scaledX[i], scaledY[i]]
    })
  }

  return geometryArray
}
