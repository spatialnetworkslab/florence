import { calculateBboxGeometry } from '../../../../../utils/geometryUtils'
import createItemFromBbox from '../../../utils/createItemFromBbox.js'

export function indexRectangle (markData) {
  const rectangleAttributes = markData.attributes

  const bbox = calculateBboxGeometry(rectangleAttributes.screenGeometry)
  const item = createItemFromBbox(bbox)

  item.attributes = rectangleAttributes
  item.markType = 'Rectangle'
  item.markId = markData.markId

  return item
}

export function indexRectangleLayer ({ layerAttributes, keyArray, layerId }) {
  const items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const rectangleAttributes = getRectangleAttributes(layerAttributes, key)
    const bbox = calculateBboxGeometry(rectangleAttributes.screenGeometry)
    const item = createItemFromBbox(bbox)

    item.key = key
    item.index = i
    item.attributes = rectangleAttributes
    item.markType = 'Rectangle'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getRectangleAttributes (layerAttributes, key) {
  return { screenGeometry: layerAttributes.screenGeometryObject[key] }
}
