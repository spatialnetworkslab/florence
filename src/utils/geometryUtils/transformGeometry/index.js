export { transformGeometry } from './rendervous.esm.js'

export function transformGeometries (geometries, transformation, settings) {
  if (geometries.constructor === Array) {
    const transformedGeometries = []

    for (let i = 0; i < geometries.length; i++) {
      transformedGeometries.push(transformation(
        geometries[i],
        transformation,
        settings
      ))
    }

    return transformedGeometries
  }

  if (geometries.constructor === Object) {
    const transformedGeometries = {}

    for (const key in geometries) {
      transformedGeometries[key] = transformation(
        geometries[key],
        transformation,
        settings
      )
    }

    return transformedGeometries
  }
}

export function transformGeometriesWithKeys (geometries, keys, transformation, settings) {
  const transformedGeometries = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    transformedGeometries[key] = transformation(
      geometries[i],
      transformation,
      settings
    )
  }

  return transformedGeometries
}
