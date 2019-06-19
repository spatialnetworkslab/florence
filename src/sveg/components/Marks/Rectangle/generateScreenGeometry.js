import { scaleGeometry } from '../utils/scaleGeometry'
import { transformGeometry } from '../utils/transformGeometry'
import { isInvalid } from '../../../utils/equals.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  ensureValidCombination(geometryProps)
  validateTypes(geometryProps)

  let geometry = getGeometry(geometryProps)
  let scaledGeometry = scaleGeometry(geometry, sectionContext)
  let screenGeometry = transformGeometry(scaledGeometry, coordinateTransformationContext)

  return screenGeometry
}

export function getGeometry ({ x1, x2, y1, y2 }) {
  return {
    type: 'LineString',
    coordinates: [
      [x1, y1],
      [x1, y2],
      [x2, y2],
      [x2, y1],
      [x1, y1]
    ]
  }
}
const s = JSON.stringify

export function ensureValidCombination ({ x1, x2, y1, y2 }) {
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

const invalidPropValueError = (value, name) => new Error(`Invalid coordinate value for '${name}': ${s(value)}`)

function validateTypes (geometryProps) {
  for (let propName in geometryProps) {
    let geometryProp = geometryProps[propName]

    if (geometryProp !== undefined) {
      if (isInvalid(geometryProp)) throw invalidPropValueError(geometryProp, propName)

      if (![Number, String, Date, Function].includes(geometryProp.constructor)) {
        throw invalidPropValueError(geometryProp, propName)
      }
    }
  }
}
