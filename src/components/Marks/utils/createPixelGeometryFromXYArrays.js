import { transformGeometry, polarGeometry } from '../../../utils/geometryUtils'
import getKeyArray from './getKeyArray.js'

export function createPixelGeometryFromXYArrays (
  { x, y },
  sectionContext,
  renderSettings,
  geometryType,
  needsScaling
) {
  validateXYArrays(x, y)

  if (geometryType === 'Polygon') {
    closeIfNecessary(x, y)
  }

  const @snlab/rendervousInput = createRendervousInput(x, y, geometryType)

  const interpolationNecessary = (
    sectionContext.transformation === 'polar' &&
    renderSettings.interpolate === true
  )

  if (interpolationNecessary) {
    const scaleTransformation = sectionContext.getScaleTransformation(needsScaling)
    const postScaleTransformation = sectionContext.postScaleTransformation

    return polarGeometry(
      @snlab/rendervousInput,
      sectionContext,
      { scaleTransformation, postScaleTransformation },
      renderSettings
    )
  }

  if (!interpolationNecessary) {
    const totalTransformation = sectionContext.getTotalTransformation(needsScaling)

    return transformGeometry(@snlab/rendervousInput, totalTransformation, renderSettings)
  }
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

function closeIfNecessary (x, y) {
  const xNotClosed = x[0] !== x[x.length - 1]
  const yNotClosed = y[0] !== y[y.length - 1]

  if (xNotClosed || yNotClosed) {
    x.push(x[0])
    y.push(y[0])
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
  renderSettings,
  geometryType,
  needsScaling
) {
  validateXYArrays(x, y)

  const keyArray = getKeyArray(keyProp, x.length)
  const pixelGeometryObject = {}

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    pixelGeometryObject[key] = createPixelGeometryFromXYArrays(
      { x: x[i], y: y[i] },
      sectionContext,
      renderSettings,
      geometryType,
      needsScaling
    )
  }

  return pixelGeometryObject
}
