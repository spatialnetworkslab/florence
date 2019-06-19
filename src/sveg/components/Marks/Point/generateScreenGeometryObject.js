import geometryValidator from '../utils/geometryValidator.js'
import { scaleGeometryObject } from '../utils/scaleGeometry'
import { transformGeometryObject } from '../utils/transformGeometry'
import getIndexArray from '../utils/getIndexArray.js'
import { ensureValidCombination, createPointGeometry } from './generateScreenGeometry.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext, indexProp) {
  ensureValidCombination(geometryProps)

  let length = getLength(geometryProps, sectionContext)
  let indexArray = getIndexArray(indexProp, length)

  let geometryObject = getGeometryObject(geometryProps, indexArray)

  let scaledGeometryObject = scaleGeometryObject(geometryObject, sectionContext)
  let screenGeometryObject = transformGeometryObject(scaledGeometryObject, coordinateTransformationContext)

  return { screenGeometryObject, indexArray }
}

function getLength (geometryProps, sectionContext) {
  if (geometryProps.geometry) {
    if (geometryProps.geometry.constructor !== Array) throw new Error(`PointLayer: geometry must be an array`)
    return geometryProps.geometry.length
  }

  if (geometryProps.x) {
    return getLengthXY(geometryProps.x, geometryProps.y, sectionContext)
  }
}

function getLengthXY (x, y, sectionContext) {
  if (!isArrayOrFunction(x) && !isArrayOrFunction(y)) throw notArrayError

  if (x.constructor === Array) return x.length
  if (y.constructor === Array) return y.length
  
  let scales = sectionContext.scales()

  if (x.constructor === Function) {
    let screenCoordinate = x(scales)
    if (screenCoordinate.constructor === Array) return screenCoordinate.length
  }

  if (y.constructor === Function) {
    let screenCoordinate = y(scales)
    if (screenCoordinate.constructor === Array) return screenCoordinate.length
  }

  throw notArrayError
}

const notArrayError = new Error(`PointLayer: at least 'x' or 'y' must evaluate to an Array`)

function isArrayOrFunction (value) {
  return value.constructor === Array || value.constructor !== Function
}

function getGeometryObject (geometryProps, indexArray) {
  let geometryObject = {}

  if (geometryProps.geometry) {
    let geometryArray = geometryProps.geometry

    for (let i = 0; i < indexArray.length; i++) {
      let geometry = geometryArray[i]
      validateGeometry(geometry)

      let $index = indexArray[i]
      geometryObject[$index] = geometry
    }
  }

  if (geometryProps.x) {
    for (let i = 0; i < indexArray.length; i++) {
      let $index = indexArray[i]
      let x = geometryProps.x.constructor === Array ? geometryProps.x[i] : geometryProps.x
      let y = geometryProps.y.constructor === Array ? geometryProps.y[i] : geometryProps.y

      geometryObject[$index] = createPointGeometry(x, y)
    }
  }

  return geometryObject
}

const validateGeometry = geometryValidator(['Point'])
