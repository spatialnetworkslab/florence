import transformGeometry from '../utils/transformGeometry'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  let scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  let screenGeometry = transformGeometry(scaledGeometry, coordinateTransformationContext)

  return screenGeometry
}

function createScaledGeometry (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (geometryProps.geometry) {
    return geometryProps.geometry
  }

  if (!geometryProps.geometry) {
    return createScaledGeometryFromCoordinates(geometryProps.x, geometryProps.y, sectionContext)
  }
}

export function ensureValidCombination (geometryProps) {
  if (geometryProps.geometry) {
    if (geometryProps.x || geometryProps.y) throw invalidCombinationError
  } else {
    if (!(geometryProps.x && geometryProps.y)) throw invalidCombinationError
  }
}

const invalidCombinationError = new Error(`Invalid combination of props 'x', 'y' and 'geometry'`)

function createScaledGeometryFromCoordinates (x, y, sectionContext) {
  const scales = sectionContext.scales()
  const { scaleX, scaleY } = scales

  const scaledX = x.constructor === Function ? x(scales) : scaleX(x)
  const scaledY = y.constructor === Function ? y(scales) : scaleY(y)

  return {
    type: 'Point',
    coordinates: [scaledX, scaledY]
  }
}
