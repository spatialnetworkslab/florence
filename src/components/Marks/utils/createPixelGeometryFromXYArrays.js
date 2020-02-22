import getTotalTransformation from './getTotalTransformation.js'
import { transformGeometry } from '../../../utils/geometryUtils'
import { isDefined } from '../../../utils/equals.js'
import getKeyArray from './getKeyArray.js'
import { validateXYProps, validateXYPropsLayer } from './geometryPropTools.js'

const needsScaling = prop => prop.constructor === Array
const inputNeedsToBeTransformed = totalTransformation => isDefined(totalTransformation)

export function createPixelGeometryFromXYArrays (
  { x, y },
  sectionContext,
  coordinateTransformationContext,
  zoomTransformation,
  renderSettings,
  geometryType
) {
  validateXYProps(x, y)

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

export function validateXYArrays (x, y) {
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

export function createPixelGeometryObjectFromXYArrays (
  { x, y },
  keyProp,
  sectionContext,
  coordinateTransformationContext,
  zoomTransformation,
  renderSettings,
  geometryType
) {
  validateXYPropsLayer(x, y)

  const xNeedsScaling = needsScaling(x)
  const yNeedsScaling = needsScaling(y)

  const xArray2d = xNeedsScaling
    ? x
    : x(sectionContext)

  const yArray2d = yNeedsScaling
    ? y
    : y(sectionContext)

  validateXYArrays(xArray2d, yArray2d)

  const keyArray = getKeyArray(keyProp, x.length)
  const pixelGeometryObject = {}

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const xArray = xNeedsScaling
      ? xArray2d[i]
      : () => xArray2d[i]

    const yArray = yNeedsScaling
      ? yArray2d[i]
      : () => yArray2d[i]

    pixelGeometryObject[key] = createPixelGeometryFromXYArrays(
      { x: xArray, y: yArray },
      sectionContext,
      coordinateTransformationContext,
      zoomTransformation,
      renderSettings,
      geometryType
    )
  }

  return pixelGeometryObject
}
