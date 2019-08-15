import { calculateBBoxGeometry } from '../../../utils/geometryUtils/index.js'
import createItemFromBBox from './utils/createItemFromBBox.js'

export function indexRectangle (markData) {
  const rectangleAttributes = markData.attributes

  const bbox = calculateBBoxGeometry(rectangleAttributes.screenGeometry)
  const item = createItemFromBBox(bbox)

  item.attributes = rectangleAttributes
  item.markType = 'Rectangle'
  item.markId = markData.markId

  return item
}

export function indexRectangleLayer ({ layerAttributes, indexArray, layerId }) {
  const items = []

  for (let i = 0; i < indexArray.length; i++) {
    const $index = indexArray[i]

    const rectangleAttributes = getRectangleAttributes(layerAttributes, $index)
    const bbox = calculateBBoxGeometry(rectangleAttributes.screenGeometry)
    const item = createItemFromBBox(bbox)

    item.$index = $index
    item.attributes = rectangleAttributes
    item.markType = 'Rectangle'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getRectangleAttributes (layerAttributes, $index) {
  return { screenGeometry: layerAttributes.screenGeometryObject[$index] }
}
