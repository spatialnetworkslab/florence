import createPixelGeometryObjectPoint from '../Point/createPixelGeometryObject.js'
import { createSymbolGeometry } from './createPixelGeometry.js'

export default function createPixelGeometryObject (
  geometryProps,
  keyProp,
  sectionContext,
  renderSettings
) {
  const pointGeometryObject = createPixelGeometryObjectPoint(
    geometryProps,
    keyProp,
    sectionContext,
    renderSettings
  )

  const symbolGeometryObject = createSymbolGeometryObject(pointGeometryObject, geometryProps)

  return symbolGeometryObject
}

function createSymbolGeometryObject (pointGeometryObject, geometryProps) {
  const keys = Object.keys(pointGeometryObject)

  const shapeGetter = createPropGetter(geometryProps.shape, keys)
  const sizeGetter = createPropGetter(geometryProps.size, keys)

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

function validatePropArrayLength (prop, length) {
  if (prop.length !== length) {
    throw new Error('If provided as Arrays, all positioning props must be the same length')
  }
}
