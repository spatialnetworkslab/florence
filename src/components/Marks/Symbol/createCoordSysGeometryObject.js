import createCoordSysGeometryObjectPoint from '../Point/createCoordSysGeometryObject.js'
import { createSymbolGeometry } from './createCoordSysGeometry.js'

export default function (geometryProps, sectionContext, coordinateTransformationContext, keyProp) {
  const pointGeometryObject = createCoordSysGeometryObjectPoint(
    geometryProps, sectionContext, coordinateTransformationContext, keyProp
  )

  const symbolGeometryObject = createSymbolGeometryObject(pointGeometryObject, geometryProps)

  return symbolGeometryObject
}

function createSymbolGeometryObject (pointGeometryObject, geometryProps) {
  const keys = Object.keys(pointGeometryObject)

  const shapeGetter = createPropGetter(geometryProps.shape, keys)
  const sizeGetter = createPropGetter(geometryProps.size, keys)

  // const shapeArray = getPropArray(geometryProps.shape, length, sectionContext)
  // const sizeArray = getPropArray(geometryProps.size, length, sectionContext)

  const symbolGeometryObject = {}

  for (const key in pointGeometryObject) {
    const shape = shapeGetter(key)
    const size = sizeGetter(key)

    symbolGeometryObject[key] = createSymbolGeometry(pointGeometryObject[key], { shape, size })
  }

  return symbolGeometryObject
}

function createPropGetter (prop, keys) {
  if (prop === undefined) return () => {}

  if (prop.constructor === Function) {
    return prop
  }

  const propObject = createPropObject(prop, keys)
  return key => propObject[key]
}

function createPropObject (prop, keys) {
  const length = keys.length
  const propObject = {}

  if (prop.constructor === Array) {
    validatePropArrayLength(prop, length)

    for (let i = 0; i < length; i++) {
      const key = keys[i]
      propObject[key] = prop[i]
    }
  } else {
    for (let i = 0; i < length; i++) {
      const key = keys[i]
      propObject[key] = prop
    }
  }

  return propObject
}

// function getPropArray (prop, length, sectionContext) {
//   if (prop === undefined) {
//     return generateArrayOfLength(prop, length)
//   }

//   if (prop.constructor === Array) {
//     validateArray(prop, length)

//     return prop
//   }

//   return generateArrayOfLength(prop, length)
// }

function validatePropArrayLength (prop, length) {
  if (prop.length !== length) {
    throw new Error('If provided as Arrays, all positioning props must be the same length')
  }
}
