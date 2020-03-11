import { transformGeometry, polarGeometry } from '../../../utils/geometryUtils'
import { isDefined } from '../../../utils/equals.js'
import getKeyArray from './getKeyArray.js'
import { validateGeometryProp, validateGeometryPropLayer } from './geometryPropTools.js'

const geometryNeedsToBeTransformed = totalTransformation => isDefined(totalTransformation)

export function createPixelGeometryFromGeometry (
  geometryProps,
  sectionContext,
  renderSettings
) {
  validateGeometryProp(geometryProps.geometry)

  const geometryNeedsScaling = geometryProps.geometry.constructor === Object

  const geometry = geometryNeedsScaling
    ? geometryProps.geometry
    : geometryProps.geometry(sectionContext)

  ensureValidGeometry(geometry)

  const interpolationNecessary = (
    sectionContext.type === 'polar' &&
    renderSettings.interpolate === true
  )

  if (interpolationNecessary) {
    return polarGeometry(
      geometry,
      sectionContext,
      { xNeedsScaling: geometryNeedsScaling, yNeedsScaling: geometryNeedsScaling },
      renderSettings
    )
  }

  if (!interpolationNecessary) {
    // const totalTransformation = 
    return transformGeometry(geometry, totalTransformation, renderSettings)
  }
}

export function ensureValidGeometry (geometry) {
  if (
    isDefined(geometry) &&
    geometry.constructor === Object &&
    'type' in geometry &&
    'coordinates' in geometry
  ) {
    return
  }

  throw new Error('Invalid geometry')
}

export function createPixelGeometryObjectFromGeometry (
  geometryProps,
  keyProp,
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  validateGeometryPropLayer(geometryProps.geometry)

  const geometryNeedsScaling = geometryProps.geometry.constructor === Array

  const geometryArray = geometryNeedsScaling
    ? geometryProps.geometry
    : geometryProps.geometry(sectionContext)

  validateGeometryArray(geometryArray)

  const keyArray = getKeyArray(keyProp, geometryArray.length)
  const pixelGeometryObject = {}

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const geometry = geometryNeedsScaling
      ? geometryArray[i]
      : () => geometryArray[i]

    pixelGeometryObject[key] = createPixelGeometryFromGeometry(
      { geometry },
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings
    )
  }

  return pixelGeometryObject
}

function validateGeometryArray (geometryArray) {
  if (isDefined(geometryArray) && geometryArray.constructor === Array) {
    return
  }

  throw new Error('\'geometry\' prop must be Array or function that returns array')
}
