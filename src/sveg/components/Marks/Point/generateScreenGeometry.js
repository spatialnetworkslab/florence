import geometryValidator from '../utils/geometryValidator.js'
import { scaleGeometry } from '../utils/scaleGeometry'
import { transformGeometry } from '../utils/transformGeometry'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  let geometry = getGeometry(geometryProps)
  let scaledGeometry = scaleGeometry(geometry, sectionContext)
  let screenGeometry = transformGeometry(scaledGeometry, coordinateTransformationContext)

  return screenGeometry
}

function getGeometry (geometryProps) {
  ensureValidCombination(geometryProps)

  if (geometryProps.geometry) {
    validateGeometry(geometryProps.geometry)
    return geometryProps.geometry
  }

  if (geometryProps.x) {
    return createPointGeometry(geometryProps.x, geometryProps.y)
  }
}

export function createPointGeometry (x, y) {
  return {
    type: 'Point',
    coordinates: [x, y]
  }
}

const validateGeometry = geometryValidator(['Point'])

export function ensureValidCombination (geometryProps) {
  if (geometryProps.geometry) {
    if (geometryProps.x || geometryProps.y) throw invalidCombinationError
  } else {
    if (!geometryProps.x && geometryProps.y) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Point: invalid combination of props 'x', 'y' and 'geometry'`)
