import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'
import { isInvalid, isUndefined, isDefined } from 'equals.js'

export default function (coordinateProps, sectionContext, coordinateTransformationContext, interpolate) {
  const scaledCoordinates = scaleCoordinates(coordinateProps, sectionContext)
  const scaledGeometry = createScaledGeometry(scaledCoordinates)

  const coordSysGeometry = createCoordSysGeometry(
    scaledGeometry,
    coordinateTransformationContext,
    interpolate
  )

  return coordSysGeometry
}

export function scaleCoordinates (coordinateProps, sectionContext) {
  ensureValidCombination(coordinateProps)
  validateTypes(coordinateProps)

  const { x1, x2, y1, y2 } = coordinateProps

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

const s = JSON.stringify

export function ensureValidCombination (c) {
  if (onlyOne(c.x1, c.x2)) {
    throw new Error(`Rectangle: invalid combination of 'x1' and 'x2': ${s(c.x1)}, ${s(c.x2)}. Either provide both or none.`)
  }

  if (onlyOne(c.y1, c.y2)) {
    throw new Error(`Rectangle: invalid combination of 'y1' and 'y2': ${s(c.y1)}, ${s(c.y2)}. Either provide both or none.`)
  }
}

function onlyOne (a, b) {
  return isUndefined(a) ? isDefined(b) : isUndefined(b)
}

const invalidCoordinateValueError = (value, name) => new Error(`Rectangle: invalid coordinate value for '${name}': ${s(value)}`)

function validateTypes (coordinates) {
  for (const coordinateName in coordinates) {
    const coordinate = coordinates[coordinateName]

    if (isDefined(coordinate)) {
      if (isInvalid(coordinate)) throw invalidCoordinateValueError(coordinate, coordinateName)

      if (![Number, String, Date, Function].includes(coordinate.constructor)) {
        throw invalidCoordinateValueError(coordinate, coordinateName)
      }
    }
  }
}

function wereSpecified (a, b) {
  return isDefined(a) && isDefined(b)
}

function scaleCoordinate (coordinate, coordinateName, sectionContext) {
  const scales = sectionContext.scales()

  if (coordinate.constructor === Function) {
    return coordinate(scales)
  } else {
    const scale = ['x1', 'x2'].includes(coordinateName) ? scales.scaleX : scales.scaleY
    const scaledCoordinate = scale(coordinate)
    throwErrorIfInvalidScaledCoordinate(coordinate, scaledCoordinate, coordinateName)

    return scaledCoordinate
  }
}

function throwErrorIfInvalidScaledCoordinate (input, output, coordinateName) {
  const parentScale = ['x1', 'x2'].includes(coordinateName) ? 'scaleX' : 'scaleY'
  if (isInvalid(output)) throw new Error(`Scale '${parentScale}' received '${s(input)}' and returned '${s(output)}`)
}

export function createScaledGeometry (c) {
  return {
    type: 'Polygon',
    coordinates: [
      [
        [c.x1, c.y1],
        [c.x2, c.y1],
        [c.x2, c.y2],
        [c.x1, c.y2],
        [c.x1, c.y1]
      ]
    ]
  }
}
