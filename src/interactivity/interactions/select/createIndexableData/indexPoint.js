import bboxPoint from './utils/bboxPoint.js'
import createItemFromBbox from '../../utils/createItemFromBbox.js'

export function indexPoint (markData) {
  const pointAttributes = markData.attributes

  const bbox = bboxPoint(pointAttributes.pixelGeometry.coordinates)
  const item = createItemFromBbox(bbox)

  item.attributes = pointAttributes
  item.markType = 'Point'
  item.markId = markData.markId

  return item
}

export function indexPointLayer ({ layerAttributes, keyArray, layerId }) {
  const items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const pointAttributes = getPointAttributes(layerAttributes, key)
    const bbox = bboxPoint(pointAttributes.pixelGeometry.coordinates)
    const item = createItemFromBbox(bbox)

    item.key = key
    item.index = i
    item.attributes = pointAttributes
    item.markType = 'Point'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getPointAttributes (layerAttributes, key) {
  return {
    pixelGeometry: layerAttributes.pixelGeometryObject[key],
    radius: layerAttributes.radiusObject[key]
  }
}
