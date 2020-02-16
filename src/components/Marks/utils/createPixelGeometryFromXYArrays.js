import getTotalTransformation from './getTotalTransformation.js'
import { transformGeometry } from '../../../utils/geometryUtils/transformGeometry/index.js'
import { isDefined } from '../../../utils/equals.js'

const needsScaling = prop => prop.constructor === Array
const inputNeedsToBeTransformed = totalTransformation => isDefined(totalTransformation)

export default function createPixelGeometryFromXYArrays (
  { x, y },
  sectionContext,
  coordinateTransformationContext,
  zoomTransformation,
  renderSettings,
  geometryType
) {
  const xNeedsScaling = needsScaling(x)
  const yNeedsScaling = needsScaling(y)

  const xArray = xNeedsScaling
    ? x
    : x(sectionContext)

  const yArray = yNeedsScaling
    ? y
    : y(sectionContext)

  validateXYArrays(xArray, yArray)

  const totalTransformation = getTotalTransformation({
    sectionContext,
    xNeedsScaling,
    yNeedsScaling,
    coordinateTransformationContext,
    zoomTransformation
  })

  const rendervousInput = createRendervousInput(x, y, geometryType)

  return inputNeedsToBeTransformed(totalTransformation)
    ? transformGeometry(rendervousInput, totalTransformation, renderSettings)
    : transformGeometry(rendervousInput, x => x, renderSettings)
}

function validateXYArrays (x, y) {
  if (x.constructor !== Array) {
    throw new Error('\'x\' prop must be Array or function that returns array')
  }

  if (y.constructor !== Array) {
    throw new Error('\'y\' prop must be Array or function that returns array')
  }

  if (x.length !== y.length) {
    throw new Error('Arrays passed to \'x\' and \'y\' must have the same length')
  }
}

function createRendervousInput (x, y, geometryType) {
  return {
    type: geometryType,
    x,
    y
  }
}
