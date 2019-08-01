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

export function indexPolygonLayer ({ layerAttributes, indexArray, layerId }) {
  const items = []

  for (let i = 0; i < indexArray.length; i++) {
    const $index = indexArray[i]

    const polygonAttributes = getPolygonAttributes(layerAttributes, $index)
    const bbox = calculateBBoxGeometry(polygonAttributes.screenGeometry)
    const item = createItemFromBBox(bbox)

    item.$index = $index
    item.attributes = polygonAttributes
    item.markType = 'Polygon'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getPolygonAttributes (layerAttributes, $index) {
  return { screenGeometry: layerAttributes.screenGeometryObject[$index] }
}
