import { calculateBboxGeometry } from '../../../../../utils/geometryUtils'
import createItemFromBbox from '../../../utils/createItemFromBbox.js'

export function indexPolygon (markData) {
  const polygonAttributes = markData.attributes

  const bbox = calculateBboxGeometry(polygonAttributes.screenGeometry)
  const item = createItemFromBbox(bbox)

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
    const bbox = calculateBboxGeometry(polygonAttributes.screenGeometry)
    const item = createItemFromBbox(bbox)

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
