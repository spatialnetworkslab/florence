import { transformGeometry, polarGeometry } from '../../../utils/geometryUtils'
import { isDefined } from '../../../utils/equals.js'
import getKeyArray from './getKeyArray.js'

export function createPixelGeometryFromGeometry (
  geometry,
  sectionContext,
  renderSettings,
  geometryNeedsScaling
) {
  ensureValidGeometry(geometry)

  const interpolationNecessary = (
    sectionContext.transformation === 'polar' &&
    renderSettings.interpolate === true
  )

  if (interpolationNecessary) {
    const scaleTransformation = sectionContext.getScaleTransformation(geometryNeedsScaling)
    const postScaleTransformation = sectionContext.postScaleTransformation

    return polarGeometry(
      geometry,
      sectionContext,
      { scaleTransformation, postScaleTransformation },
      renderSettings
    )
  }

  if (!interpolationNecessary) {
    const totalTransformation = sectionContext.getTotalTransformation(geometryNeedsScaling)

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
  geometry,
  keyProp,
  sectionContext,
  renderSettings,
  geometryNeedsScaling
) {
  const keyArray = getKeyArray(keyProp, geometry.length)
  const pixelGeometryObject = {}

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    pixelGeometryObject[key] = createPixelGeometryFromGeometry(
      geometry[i],
      sectionContext,
      renderSettings,
      geometryNeedsScaling
    )
  }

  return pixelGeometryObject
}
