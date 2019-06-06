import { isInvalid } from '../../../utils/equals.js'
import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'

export function generateCoordinates (coordinates, sectionContext, coordinateTransformationContext, interpolate) {
  let scaledCoordinates = scaleCoordinates(coordinates, sectionContext)
  let cornerPoints = createCornerPoints(scaledCoordinates)
  let transformedPoints = applyCoordinateTransformation(
    cornerPoints,
    coordinateTransformationContext,
    interpolate
  )

  return transformedPoints
}

export function scaleCoordinates (coordinates, sectionContext) {
  throwErrorIfInvalidCombination(coordinates)
  validateTypes(coordinates)

  const { x1, x2, y1, y2 } = coordinates

  const scaledCoordinates = {}

  if (wereSpecified(x1, x2)) {
    scaledCoordinates.x1 = scaleCoordinate(x1, 'x1', sectionContext)
    scaledCoordinates.x2 = scaleCoordinate(x2, 'x2', sectionContext)
  } else {
    scaledCoordinates.x1 = sectionContext.x1()
    scaledCoordinates.x2 = sectionContext.x2()
  }

  if (wereSpecified(y1, y2)) {
    scaledCoordinates.y1 = scaleCoordinate(y1, 'y1', sectionContext)
    scaledCoordinates.y2 = scaleCoordinate(y2, 'y2', sectionContext)
  } else {
    scaledCoordinates.y1 = sectionContext.y1()
    scaledCoordinates.y2 = sectionContext.y2()
  }

  return scaledCoordinates
}

export function createCornerPoints ({ x1, x2, y1, y2 }) {
  return [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1],
    [x1, y1]
  ]
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

function wereSpecified (a, b) {
  return a !== undefined && b !== undefined
}

function scaleCoordinate (coordinate, coordinateName, sectionContext) {
  const scales = sectionContext.scales()

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
