export function createDataNecessaryForIndexingMark (type, markId, geometryTypes, aesthetics) {
  const markData = { markId }
  let attributes

  if (type === 'Point') {
    attributes = {
      pixelGeometry: geometryTypes.pixelGeometry,
      radius: aesthetics.radius
    }
  }

  if (type === 'Label') {
    attributes = {
      pixelGeometry: geometryTypes.pixelGeometry,
      radius: aesthetics.fontSize
    }
  }

  if (type === 'Rectangle') {
    attributes = { screenGeometry: geometryTypes.screenGeometry }
  }

  if (type === 'Polygon') {
    attributes = { screenGeometry: geometryTypes.screenGeometry }
  }

  if (type === 'Line') {
    attributes = {
      pixelGeometry: geometryTypes.pixelGeometry,
      strokeWidth: aesthetics.strokeWidth
    }
  }

  if (type === 'Symbol') {
    attributes = { screenGeometry: geometryTypes.screenGeometry }
  }

  if (type === 'Area') {
    attributes = { screenGeometry: geometryTypes.screenGeometry }
  }

  markData.attributes = attributes

  return markData
}

export function createDataNecessaryForIndexingLayer (
  type, layerId, keyArray, geometryObjects, aestheticsObjects
) {
  const layerData = { layerId, keyArray }
  let layerAttributes

  if (type === 'Point') {
    layerAttributes = {
      pixelGeometryObject: geometryObjects.pixelGeometryObject,
      radiusObject: aestheticsObjects.radiusObject
    }
  }

  if (type === 'Label') {
    layerAttributes = {
      pixelGeometryObject: geometryObjects.pixelGeometryObject,
      radiusObject: aestheticsObjects.fontSizeObject
    }
  }

  if (type === 'Rectangle') {
    layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject }
  }

  if (type === 'Polygon') {
    layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject }
  }

  if (type === 'Line') {
    layerAttributes = {
      pixelGeometryObject: geometryObjects.pixelGeometryObject,
      strokeWidthObject: aestheticsObjects.strokeWidthObject
    }
  }

  if (type === 'Symbol') {
    layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject }
  }

  if (type === 'Area') {
    layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject }
  }

  layerData.layerAttributes = layerAttributes

  return layerData
}
