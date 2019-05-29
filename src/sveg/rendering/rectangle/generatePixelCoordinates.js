import { isInvalid } from '../../utils/equals.js'

export default function (coordinates, coordinateContext) {
  throwErrorIfInvalidCombination(coordinates)
  validateTypes(coordinates)

  return generatePixelCoordinates(coordinates, coordinateContext)
}

const s = JSON.stringify

function throwErrorIfInvalidCombination ({ x, w, y, h }) {
  if (onlyOne(x, w)) {
    throw new Error(`Invalid combination of 'x' and 'w': ${s(x)}, ${s(w)}. Either provide both or none.`)
  }

  if (onlyOne(y, h)) {
    throw new Error(`Invalid combination of 'y' and 'h': ${s(y)}, ${s(h)}. Either provide both or none.`)
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
      if (!coordinate) throw invalidCoordinateValueError(coordinate, coordinateName)
  
      if (![Number, String, Date, Function].includes(coordinate.constructor)) {
        throw invalidCoordinateValueError(coordinate, coordinateName)
      }
    }
  }
}

function generatePixelCoordinates ({ x, w, y, h }, coordinateContext) {
  const pixelCoordinates = {}

  if (wereSpecified(x, w)) {
    pixelCoordinates.x = generateCoordinate(x, 'x', coordinateContext)
    pixelCoordinates.w = generateCoordinate(w, 'w', coordinateContext)
  } else {
    pixelCoordinates.x = coordinateContext.x()
    pixelCoordinates.w = coordinateContext.w()
  }

  if (wereSpecified(y, h)) {
    pixelCoordinates.y = generateCoordinate(y, 'y', coordinateContext)
    pixelCoordinates.h = generateCoordinate(h, 'h', coordinateContext)
  } else {
    pixelCoordinates.y = coordinateContext.y()
    pixelCoordinates.h = coordinateContext.h()
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
    const scale = ['x', 'w'].includes(coordinateName) ? scales.scaleX : scales.scaleY
    const generatedCoordinate = scale(coordinate)
    throwErrorIfInvalidValue(coordinate, generatedCoordinate, coordinateName)

    return generatedCoordinate
  }
}

function throwErrorIfInvalidValue (input, output, coordinateName) {
  const parentScale = ['x', 'w'].includes(coordinateName) ? 'scaleX' : 'scaleY'
  if (isInvalid(output)) throw new Error(`Scale '${parentScale}' received '${s(input)}' and returned '${s(output)}`)
}