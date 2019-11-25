import createCoordSysGeometryObjectPoint from '../Point/createCoordSysGeometryObject.js'
import { createSymbolGeometry } from './createCoordSysGeometry.js'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext, keyProp) {
  const pointGeometryObject = createCoordSysGeometryObjectPoint(
    geometryProps, sectionContext, coordinateTransformationContext, keyProp
  )

  const symbolGeometryObject = createSymbolGeometryObject(pointGeometryObject, geometryProps)

  return symbolGeometryObject
}

function createSymbolGeometryObject (pointGeometryObject, geometryProps) {
  const keys = Object.keys(pointGeometryObject)
  const length = keys.length
  const shapeArray = getPropArray(geometryProps.shape, length)
  const sizeArray = getPropArray(geometryProps.size, length)

  const symbolGeometryObject = {}

  for (let i = 0; i < length; i++) {
    const key = keys[i]
    const shape = shapeArray[i]
    const size = sizeArray[i]

    symbolGeometryObject[key] = createSymbolGeometry(pointGeometryObject[key], { shape, size })
  }

  return symbolGeometryObject
}

function getPropArray (prop, length) {
  if (prop.constructor === Array) {
    if (prop.length !== length) {
      throw new Error('If provided as Arrays, all positioning props must be the same length')
    }

    return prop
  }

  return generateArrayOfLength(prop, length)
}
