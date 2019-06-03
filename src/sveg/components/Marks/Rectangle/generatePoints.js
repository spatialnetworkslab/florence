import { isInvalid } from '../../../utils/equals.js'
import resample from '../utils/resample.js'
import { roundPointArray } from '../../../utils/round.js'

export default function (coordinates, coordinateContext, transformationContext) {
  throwErrorIfInvalidCombination(coordinates)
  validateTypes(coordinates)

  let pixelCoordinates = generatePixelCoordinates(coordinates, coordinateContext)
  let points = generatePoints(pixelCoordinates)
  points = resample(points, transformationContext)

  return roundPointArray(points)
}

const s = JSON.stringify

function throwErrorIfInvalidCombination ({ x1, x2, y1, y2 }) {
  if (onlyOne(x1, x2)) {
    throw new Error(`Invalid combination of 'x1' and 'x2': ${s(x1)}, ${s(x2)}. Either provide both or none.`)
  }

  if (onlyOne(y1, y2)) {
    throw new Error(`Invalid combination of 'y1' and 'y2': ${s(y1)}, ${s(y2)}. Either provide both or none.`)
  }
}

function onlyOne (a, b) {
  return a === undefined ? b !== undefined : b === undefined
}

const invalidCoordinateValueError = (value, name) => new Error(`Invalid coordinate value for '${name}': ${s(value)}`)

function validateTypes (coordinates) {
  for (let coordinateName in coordinates) {
    let coordinate = coordinates[coordinateName]

    if (coordinate !== undefined) {
      if (isInvalid(coordinate)) throw invalidCoordinateValueError(coordinate, coordinateName)

      if (![Number, String, Date, Function].includes(coordinate.constructor)) {
        throw invalidCoordinateValueError(coordinate, coordinateName)
      }
    }
  }
}

export function generatePixelCoordinates ({ x1, x2, y1, y2 }, coordinateContext) {
  const pixelCoordinates = {}

  if (wereSpecified(x1, x2)) {
    pixelCoordinates.x1 = generateCoordinate(x1, 'x1', coordinateContext)
    pixelCoordinates.x2 = generateCoordinate(x2, 'x2', coordinateContext)
  } else {
    pixelCoordinates.x1 = coordinateContext.x1()
    pixelCoordinates.x2 = coordinateContext.x2()
  }

  if (wereSpecified(y1, y2)) {
    pixelCoordinates.y1 = generateCoordinate(y1, 'y1', coordinateContext)
    pixelCoordinates.y2 = generateCoordinate(y2, 'y2', coordinateContext)
  } else {
    pixelCoordinates.y1 = coordinateContext.y1()
    pixelCoordinates.y2 = coordinateContext.y2()
  }

  return pixelCoordinates
}

function wereSpecified (a, b) {
  return a !== undefined && b !== undefined
}

function generateCoordinate (coordinate, coordinateName, coordinateContext) {
  const scales = coordinateContext.scales()

  if (coordinate.constructor === Function) {
    return coordinate(scales)
  } else {
    const scale = ['x1', 'x2'].includes(coordinateName) ? scales.scaleX : scales.scaleY
    const generatedCoordinate = scale(coordinate)
    throwErrorIfInvalidValue(coordinate, generatedCoordinate, coordinateName)

    return generatedCoordinate
  }
}

function throwErrorIfInvalidValue (input, output, coordinateName) {
  const parentScale = ['x1', 'x2'].includes(coordinateName) ? 'scaleX' : 'scaleY'
  if (isInvalid(output)) throw new Error(`Scale '${parentScale}' received '${s(input)}' and returned '${s(output)}`)
}

function generatePoints ({ x1, x2, y1, y2 }) {
  return [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1],
    [x1, y1]
  ]
}
