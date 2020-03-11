import {
  ensureValidGeometryProps,
  getInputType,
  validateXYProps,
  validateGeometryPropLayer
} from '../utils/geometryPropTools.js'

import { validateXYArrays } from '../utils/createPixelGeometryFromXYArrays.js'
import { ensureValidGeometry } from '../utils/createPixelGeometryFromGeometry.js'
import propNeedsScaling from '../utils/propNeedsScaling.js'
import getKeyArray from '../utils/getKeyArray.js'

export default function createPixelGeometryObject (
  geometryProps,
  keyProp,
  sectionContext,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)

  const inputType = getInputType(geometryProps)

  if (inputType === 'xy') {
    return createPixelGeometryObjectFromCoordinates(
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    )
  }

  if (inputType === 'geometry') {
    return createPixelGeometryObjectFromGeometry(
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    )
  }
}

function createPixelGeometryObjectFromCoordinates (
  { x, y },
  keyProp,
  sectionContext,
  renderSettings
) {
  validateXYProps(x, y)

  const xNeedsScaling = propNeedsScaling(x)
  const yNeedsScaling = propNeedsScaling(y)

  const xScaled = xNeedsScaling
    ? x
    : x(sectionContext)

  const yScaled = yNeedsScaling
    ? y
    : y(sectionContext)

  const { xArray, yArray } = applyRecyclingIfNecessary(xScaled, yScaled)
  validateXYArrays(xArray, yArray)

  const keyArray = getKeyArray(keyProp, xArray.length)

  const totalTransformation = sectionContext.getTotalTransformation({ xNeedsScaling, yNeedsScaling })

  return transformXYArraysIntoGeometryObject(xArray, yArray, keyArray, totalTransformation)
}

function applyRecyclingIfNecessary (xScaled, yScaled) {
  if (xScaled.constructor !== Array && yScaled.constructor !== Array) {
    throw new Error('Invalid input: cannot recycle all geometry props')
  }

  return {
    xArray: xScaled.constructor === Array ? xScaled : recycle(xScaled, yScaled.length),
    yArray: yScaled.constructor === Array ? yScaled : recycle(yScaled, xScaled.length)
  }
}

function recycle (value, length) {
  return new Array(length).fill(value)
}

function transformXYArraysIntoGeometryObject (xArray, yArray, keyArray, transformation) {
  const geometryObject = {}

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    geometryObject[key] = {
      type: 'Point',
      coordinates: transformation([
        xArray[i],
        yArray[i]
      ])
    }
  }

  return geometryObject
}

function createPixelGeometryObjectFromGeometry (
  geometryProps,
  keyProp,
  sectionContext,
  renderSettings
) {
  validateGeometryPropLayer(geometryProps.geometry)

  const geometryNeedsScaling = propNeedsScaling(geometryProps.geometry)

  const geometry = geometryNeedsScaling
    ? geometryProps.geometry
    : geometryProps.geometry(sectionContext)

  ensureValidGeometry(geometry)

  const keyArray = getKeyArray(keyProp, geometry.length)

  const totalTransformation = sectionContext.getTotalTransformation(geometryNeedsScaling)

  return transformGeometryArrayIntoGeometryObject(
    geometry,
    keyArray,
    totalTransformation
  )
}

function transformGeometryArrayIntoGeometryObject (geometryArray, keyArray, transformation) {
  const geometryObject = {}

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    geometryObject[key] = {
      type: 'Point',
      coordinates: transformation(geometryArray[i].coordinates)
    }
  }

  return geometryObject
}
