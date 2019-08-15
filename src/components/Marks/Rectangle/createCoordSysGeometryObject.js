import { createCoordSysGeometryObject } from '../utils/createCoordSysGeometry.js'
import { createScaledGeometry, ensureValidCombination } from './createCoordSysGeometry.js'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import getIndexArray from '../utils/getIndexArray.js'

export default function (
  coordinateProps, sectionContext, coordinateTransformationContext, indexProp, interpolate
) {
  const { scaledCoordinates, length } = scaleCoordinates(coordinateProps, sectionContext)
  const indexArray = getIndexArray(indexProp, length)
  const scaledGeometryArray = createScaledGeometryArray(scaledCoordinates, length)
  const coordSysGeometryObject = createCoordSysGeometryObject(
    scaledGeometryArray, coordinateTransformationContext, indexArray, interpolate
  )

  return coordSysGeometryObject
}

function scaleCoordinates (coordinateProps, sectionContext) {
  ensureValidCombination(coordinateProps)

  const coordinatesThatNeedScaling = whichCoordinatesNeedScaling(coordinateProps)

  const nonMissingCoordinates = getMissingCoordinatesFromContext(coordinateProps, sectionContext)
  const coordinateValues = getCoordinateValues(nonMissingCoordinates, sectionContext)

  const length = getNRectangles(coordinateValues)

  const coordinatesThatArePrimitive = whichCoordinatesArePrimitive(coordinateValues)

  const scaledCoordinates = _scaleCoordinates(
    coordinateValues,
    sectionContext.scales(),
    coordinatesThatNeedScaling,
    coordinatesThatArePrimitive,
    length
  )

  return { scaledCoordinates, length }
}

const coordinateNames = ['x1', 'x2', 'y1', 'y2']

function whichCoordinatesNeedScaling (coordinates) {
  const coordinatesThatNeedScaling = {}

  for (const coordinateName of coordinateNames) {
    const coordinateValue = coordinates[coordinateName]
    coordinatesThatNeedScaling[coordinateName] = coordinateValue && coordinateValue.constructor !== Function
  }

  return coordinatesThatNeedScaling
}

function getMissingCoordinatesFromContext (coordinates, sectionContext) {
  const nonMissingCoordinates = {}

  for (const coordinateName of coordinateNames) {
    const coordinateValue = coordinates[coordinateName]
    nonMissingCoordinates[coordinateName] = coordinateValue || sectionContext[coordinateName]
  }

  return nonMissingCoordinates
}

function getCoordinateValues (nonMissingCoordinates, sectionContext) {
  const scales = sectionContext.scales()
  const coordinateValues = {}

  for (const coordinateName in nonMissingCoordinates) {
    const coordinateValue = nonMissingCoordinates[coordinateName]
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

  for (const coordinateName in coordinateValues) {
    const coordinateValue = coordinateValues[coordinateName]

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
  const coordinatesThatArePrimitive = {}

  for (const coordinateName in coordinateValues) {
    const coordinateValue = coordinateValues[coordinateName]

    coordinatesThatArePrimitive[coordinateName] = coordinateValue.constructor !== Array
  }

  return coordinatesThatArePrimitive
}

function _scaleCoordinates (
  coordinateValues, scales, coordinatesThatNeedScaling, coordinatesThatArePrimitive, length
) {
  const scaledCoordinates = {}

  for (const coordinateName in coordinateValues) {
    const coordinateValue = coordinateValues[coordinateName]
    let array
    const scale = coordinateName.startsWith('x') ? scales.scaleX : scales.scaleY

    if (coordinatesThatArePrimitive[coordinateName]) array = generateArrayOfLength(coordinateValue, length)
    if (!coordinatesThatArePrimitive[coordinateName]) array = coordinateValue

    scaledCoordinates[coordinateName] = coordinatesThatNeedScaling[coordinateName]
      ? array.map(scale)
      : array
  }

  return scaledCoordinates
}

function createScaledGeometryArray (scaledCoordinates, length) {
  const scaledGeometryArray = []

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
