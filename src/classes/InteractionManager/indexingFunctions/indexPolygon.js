import { calculateBBoxGeometry } from '../../../utils/geometryUtils/index.js'
import createItemFromBBox from './utils/createItemFromBBox.js'

export function indexPolygon (markData) {
  const polygonAttributes = markData.attributes

  const bbox = calculateBBoxGeometry(polygonAttributes.screenGeometry)
  const item = createItemFromBBox(bbox)

  item.attributes = polygonAttributes
  item.markType = 'Polygon'
  item.markId = markData.markId

  return item
}

export function indexPolygonLayer ({ layerAttributes, keyArray, layerId }) {
  const items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const polygonAttributes = getPolygonAttributes(layerAttributes, key)
    const bbox = calculateBBoxGeometry(polygonAttributes.screenGeometry)
    const item = createItemFromBBox(bbox)

    item.key = key
    item.index = i
    item.attributes = polygonAttributes
    item.markType = 'Polygon'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getPolygonAttributes (layerAttributes, key) {
  return { screenGeometry: layerAttributes.screenGeometryObject[key] }
}
