import { createCornerPoints, throwErrorIfInvalidCombination } from './generateCoordinates.js'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'
import getIndexArray from '../utils/getIndexArray.js'

export function generateCoordinatesLayer (
  coordinates, sectionContext, coordinateTransformationContext, interpolate, indexProp
) {
  let { scaledCoordinates, length } = scaleCoordinates(coordinates, sectionContext)

  let indexArray = getIndexArray(indexProp, length)

  let cornerPointsLayer = createCornerPointsLayer(scaledCoordinates, length)

  let transformedCoordinates = transformCoordinatesLayer(
    cornerPointsLayer,
    coordinateTransformationContext,
    interpolate,
    indexArray
  )

  return { coordinateObject: transformedCoordinates, indexArray }
}

function scaleCoordinates (coordinates, sectionContext) {
  throwErrorIfInvalidCombination(coordinates)

  let coordinatesThatNeedScaling = whichCoordinatesNeedScaling(coordinates)

  let nonMissingCoordinates = getMissingCoordinatesFromContext(coordinates, sectionContext)
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

function createCornerPointsLayer (scaledCoordinates, length) {
  let cornerPointsLayer = []

  for (let i = 0; i < length; i++) {
    cornerPointsLayer.push(
      createCornerPoints({
        x1: scaledCoordinates.x1[i],
        x2: scaledCoordinates.x2[i],
        y1: scaledCoordinates.y1[i],
        y2: scaledCoordinates.y2[i]
      })
    )
  }

  return cornerPointsLayer
}

function transformCoordinatesLayer (cornerPointsLayer, coordinateTransformationContext, interpolate, indexArray) {
  let transformedCoordinatesLayer = {}

  for (let i = 0; i < cornerPointsLayer.length; i++) {
    let cornerPoints = cornerPointsLayer[i]

    let transformedCoordinates = applyCoordinateTransformation(
      cornerPoints, 'LineString', coordinateTransformationContext, interpolate
    )

    let index = indexArray[i]

    transformedCoordinatesLayer[index] = transformedCoordinates
  }

  return transformedCoordinatesLayer
}
