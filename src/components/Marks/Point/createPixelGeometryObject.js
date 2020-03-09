import {
  ensureValidGeometryProps,
  getInputType,
  validateXYProps,
  validateGeometryPropLayer
} from '../utils/geometryPropTools.js'

import { validateXYArrays } from '../utils/createPixelGeometryFromXYArrays.js'
import { ensureValidGeometry } from '../utils/createPixelGeometryFromGeometry.js'
import getKeyArray from '../utils/getKeyArray.js'
import getTotalTransformation from '../utils/getTotalTransformation.js'

const needsScaling = prop => prop.constructor === Array

export default function createPixelGeometryObject (
  geometryProps,
  keyProp,
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  ensureValidGeometryProps(geometryProps)

  const inputType = getInputType(geometryProps)

  if (inputType === 'xy') {
    return createPixelGeometryObjectFromCoordinates(
      geometryProps,
      keyProp,
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings
    )
  }

  if (inputType === 'geometry') {
    return createPixelGeometryObjectFromGeometry(
      geometryProps,
      keyProp,
      sectionContext,
      coordinateTransformationContext,
      zoomContext,
      renderSettings
    )
  }
}

function createPixelGeometryObjectFromCoordinates (
  { x, y },
  keyProp,
  sectionContext,
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  validateXYProps(x, y)

  const xNeedsScaling = needsScaling(x)
  const yNeedsScaling = needsScaling(y)

  const xScaled = xNeedsScaling
    ? x
    : x(sectionContext)

  const yScaled = yNeedsScaling
    ? y
    : y(sectionContext)

  const { xArray, yArray } = applyRecyclingIfNecessary(xScaled, yScaled)

  validateXYArrays(xArray, yArray)

  const keyArray = getKeyArray(keyProp, xArray.length)

  const totalTransformation = getTotalTransformation({
    sectionContext,
    xNeedsScaling,
    yNeedsScaling,
    coordinateTransformationContext,
    zoomContext
  })

  return totalTransformation
    ? transformXYArraysIntoGeometryObject(xArray, yArray, keyArray, totalTransformation)
    : transformXYArraysIntoGeometryObject(xArray, yArray, keyArray, x => x)
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
  coordinateTransformationContext,
  zoomContext,
  renderSettings
) {
  validateGeometryPropLayer(geometryProps.geometry)

  const geometryNeedsScaling = needsScaling(geometryProps.geometry)

  const geometry = geometryNeedsScaling
    ? geometryProps.geometry
    : geometryProps.geometry(sectionContext)

  ensureValidGeometry(geometry)

  const keyArray = getKeyArray(keyProp, geometry.length)

  const totalTransformation = getTotalTransformation({
    sectionContext,
    xNeedsScaling: geometryNeedsScaling,
    yNeedsScaling: geometryNeedsScaling,
    coordinateTransformationContext,
    zoomContext
  })

  return totalTransformation
    ? transformGeometryArrayIntoGeometryObject(geometry, keyArray, totalTransformation)
    : transformGeometryArrayIntoGeometryObject(geometry, keyArray, x => x)
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
