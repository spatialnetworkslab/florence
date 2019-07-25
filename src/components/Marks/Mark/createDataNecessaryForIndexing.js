export function createDataNecessaryForIndexingMark (type, markId, geometryTypes, aesthetics) {
  const markData = { markId }
  let attributes

  if (type === 'Point') {
    attributes = {
      pixelGeometry: geometryTypes.pixelGeometry,
      radius: aesthetics.radius
    }
  }

  if (type === 'Rectangle') {
    attributes = { screenGeometry: geometryTypes.screenGeometry }
  }

  if (type === 'Polygon') {
    attributes = { screenGeometry: geometryTypes.screenGeometry }
  }

  markData.attributes = attributes

  return markData
}

export function createDataNecessaryForIndexingLayer (
  type, layerId, indexArray, geometryObjects, aestheticsObjects
) {
  const layerData = { layerId, indexArray }
  let layerAttributes

  if (type === 'Point') {
    layerAttributes = {
      pixelGeometryObject: geometryObjects.pixelGeometryObject,
      radiusObject: aestheticsObjects.radiusObject
    }
  }

  if (type === 'Rectangle') {
    layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject }
  }

  if (type === 'Polygon') {
    layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject }
  }

  layerData.layerAttributes = layerAttributes

  return layerData
}
