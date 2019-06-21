import { createScreenGeometryObject } from '../utils/createScreenGeometry.js'
import { createScaledGeometry, ensureValidCombination } from './generateScreenGeometry.js'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import getIndexArray from '../utils/getIndexArray.js'

export default function (
  coordinateProps, sectionContext, coordinateTransformationContext, interpolate, indexProp
) {
  let { scaledCoordinates, length } = scaleCoordinates(coordinateProps, sectionContext)
  let indexArray = getIndexArray(indexProp, length)
  let scaledGeometryArray = createScaledGeometryArray(scaledCoordinates, length)
  let screenGeometryObject = createScreenGeometryObject(scaledGeometryArray, coordinateTransformationContext, indexArray, interpolate)

  return { screenGeometryObject, indexArray }
}

function scaleCoordinates (coordinateProps, sectionContext) {
  ensureValidCombination(coordinateProps)

  let coordinatesThatNeedScaling = whichCoordinatesNeedScaling(coordinateProps)

  let nonMissingCoordinates = getMissingCoordinatesFromContext(coordinateProps, sectionContext)
  let coordinateValues = getCoordinateValues(nonMissingCoordinates, sectionContext)

  let length = getNRectangles(coordinateValues)

  let coordinatesThatArePrimitive = whichCoordinatesArePrimitive(coordinateValues)

  let scaledCoordinates = _scaleCoordinates(
    coordinateValues,
    sectionContext.scales(),
    coordinatesThatNeedScaling,
    coordinatesThatArePrimitive,
    length
  )

  return { scaledCoordinates, length }
}

function whichCoordinatesNeedScaling (coordinates) {
  let coordinatesThatNeedScaling = {}

  for (let coordinateName in coordinates) {
    let coordinateValue = coordinates[coordinateName]
    coordinatesThatNeedScaling[coordinateName] = coordinateValue && coordinateValue.constructor !== Function
  }

  return coordinatesThatNeedScaling
}

function getMissingCoordinatesFromContext (coordinates, sectionContext) {
  let nonMissingCoordinates = {}

  for (let coordinateName in coordinates) {
    let coordinateValue = coordinates[coordinateName]
    nonMissingCoordinates[coordinateName] = coordinateValue || sectionContext[coordinateName]()
  }

  return nonMissingCoordinates
}

function getCoordinateValues (nonMissingCoordinates, sectionContext) {
  let scales = sectionContext.scales()
  let coordinateValues = {}

  for (let coordinateName in nonMissingCoordinates) {
    let coordinateValue = nonMissingCoordinates[coordinateName]
    if (coordinateValue.constructor === Function) {
      coordinateValues[coordinateName] = coordinateValue(scales)
    } else {
      coordinateValues[coordinateName] = coordinateValue
    }
  }

  return coordinateValues
}

const invalidCoordinateError = new Error('RectangleLayer: invalid coordinate specification')

function getNRectangles (coordinateValues) {
  let atLeastOneArray = false
  let length

  for (let coordinateName in coordinateValues) {
    let coordinateValue = coordinateValues[coordinateName]

    if (coordinateValue.constructor === Array) {
      atLeastOneArray = true
      length = length || coordinateValue.length

      if (length !== coordinateValue.length) throw invalidCoordinateError
    }
  }

  if (!atLeastOneArray) throw invalidCoordinateError

  return length
}

function whichCoordinatesArePrimitive (coordinateValues) {
  let coordinatesThatArePrimitive = {}

  for (let coordinateName in coordinateValues) {
    let coordinateValue = coordinateValues[coordinateName]

    coordinatesThatArePrimitive[coordinateName] = coordinateValue.constructor !== Array
  }

  return coordinatesThatArePrimitive
}

function _scaleCoordinates (
  coordinateValues, scales, coordinatesThatNeedScaling, coordinatesThatArePrimitive, length
) {
  let scaledCoordinates = {}

  for (let coordinateName in coordinateValues) {
    let coordinateValue = coordinateValues[coordinateName]
    let array
    let scale = coordinateName.startsWith('x') ? scales.scaleX : scales.scaleY

    if (coordinatesThatArePrimitive[coordinateName]) array = generateArrayOfLength(coordinateValue, length)
    if (!coordinatesThatArePrimitive[coordinateName]) array = coordinateValue

    scaledCoordinates[coordinateName] = coordinatesThatNeedScaling[coordinateName]
      ? array.map(scale)
      : array
  }

  return scaledCoordinates
}

function createScaledGeometryArray (scaledCoordinates, length) {
  let scaledGeometryArray = []

  for (let i = 0; i < length; i++) {
    scaledGeometryArray.push(
      createScaledGeometry({
        x1: scaledCoordinates.x1[i],
        x2: scaledCoordinates.x2[i],
        y1: scaledCoordinates.y1[i],
        y2: scaledCoordinates.y2[i]
      })
    )
  }

  return scaledGeometryArray
}
