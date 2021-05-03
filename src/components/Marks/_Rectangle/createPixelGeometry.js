import { createPixelGeometryFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'
import { isDefined, isUndefined, isInvalid } from '../../../utils/equals.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  renderSettings
) {
  const scaledCoordinates = scaleCoordinates(geometryProps, sectionContext)
  const scaledGeometry = createScaledGeometry(scaledCoordinates)

  return createPixelGeometryFromGeometry(
    scaledGeometry,
    sectionContext,
    renderSettings,
    false
  )
}

export function scaleCoordinates (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)
  validateTypes(geometryProps)

  const { x1, x2, y1, y2 } = geometryProps

  const scaledCoordinates = {}

  if (wereSpecified(x1, x2)) {
    scaledCoordinates.x1 = scaleCoordinate(x1, 'x1', sectionContext)
    scaledCoordinates.x2 = scaleCoordinate(x2, 'x2', sectionContext)
  } else {
    scaledCoordinates.x1 = sectionContext.rangeX[0]
    scaledCoordinates.x2 = sectionContext.rangeX[1]
  }

  if (wereSpecified(y1, y2)) {
    scaledCoordinates.y1 = scaleCoordinate(y1, 'y1', sectionContext)
    scaledCoordinates.y2 = scaleCoordinate(y2, 'y2', sectionContext)
  } else {
    scaledCoordinates.y1 = sectionContext.rangeY[0]
    scaledCoordinates.y2 = sectionContext.rangeY[1]
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

function validateTypes (geometryProps) {
  for (const coordinateName in geometryProps) {
    const coordinate = geometryProps[coordinateName]

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
  if (coordinate.constructor === Function) {
    return coordinate(sectionContext)
  } else {
    const scale = ['x1', 'x2'].includes(coordinateName) ? sectionContext.scaleX : sectionContext.scaleY
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
