import { createScreenGeometryObject } from '../utils/createScreenGeometry.js'
import { scaleGeometries } from 'geometryUtils'
import { ensureValidCombination, createGeometryFromScaledProps } from './generateScreenGeometry.js'
import getIndexArray from '../utils/getIndexArray.js'
import { isDefined, isUndefined } from 'equals.js'
import getNumberOfMarks from '../utils/getNumberOfMarks.js'

export default function (
  geometryProps, sectionContext, coordinateTransformationContext, interpolate, indexProp
) {
  let { scaledGeometryArray, length } = createScaledGeometryArray(geometryProps, sectionContext)
  let indexArray = getIndexArray(indexProp, length)
  let screenGeometryObject = createScreenGeometryObject(
    scaledGeometryArray, coordinateTransformationContext, indexArray, interpolate
  )

  return { screenGeometryObject, indexArray }
}

function createScaledGeometryArray (geometryProps, sectionContext) {
  ensureValidCombination(geometryProps)

  if (isDefined(geometryProps.geometry)) {
    return scaleGeometryProp(geometryProps.geometry, sectionContext)
  }

  if (isUndefined(geometryProps.geometry)) {
    return createScaledGeometryArrayFromCoordinates(
      geometryProps.x, geometryProps.y, sectionContext
    )
  }
}

function scaleGeometryProp (geometry, sectionContext) {
  let scaledGeometryArray = scaleGeometries(geometry, sectionContext.scales())
  let length = scaledGeometryArray.length

  return { scaledGeometryArray, length }
}

function createScaledGeometryArrayFromCoordinates (x, y, sectionContext) {
  let scales = sectionContext.scales()
  let { scaleX, scaleY } = scales

  let xNeedsScaling = x.constructor !== Function
  let yNeedsScaling = y.constructor !== Function

  let xValues = xNeedsScaling ? x : x(scales)
  let yValues = yNeedsScaling ? y : y(scales)

  let length = getNumberOfPolygons(xValues, yValues)

  let scaledGeometryArray = []

  for (let i = 0; i < xValues.length; i++) {
    let scaledX = xNeedsScaling ? x[i].map(scaleX) : xValues[i]
    let scaledY = yNeedsScaling ? y[i].map(scaleY) : yValues[i]

    let scaledGeometry = createGeometryFromScaledProps(scaledX, scaledY)
    scaledGeometryArray.push(scaledGeometry)
  }

  return { scaledGeometryArray, length }
}

const getNumberOfPolygons = getNumberOfMarks('PolygonLayer')
