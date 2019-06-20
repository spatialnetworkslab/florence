import { calculateBBoxGeometry } from 'geometryUtils'

export function indexRectangle (markData) {
  let rectangleAttributes = markData.attributes

  let bbox = calculateBBoxGeometry(rectangleAttributes.screenGeometry)
  let item = initItem(bbox)

  item.attributes = rectangleAttributes
  item.markType = 'Rectangle'
  item.markId = markData.markId

  return item
}

export function indexRectangleLayer ({ layerAttributes, indexArray, layerId }) {
  let items = []

  for (let i = 0; i < indexArray.length; i++) {
    let $index = indexArray[i]

    let rectangleAttributes = getRectangleAttributes(layerAttributes, $index)
    let bbox = calculateBBoxGeometry(rectangleAttributes.screenGeometry)
    let item = initItem(bbox)

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

function initItem (bbox) {
  return {
    minX: bbox.x[0],
    maxX: bbox.x[1],
    minY: bbox.y[0],
    maxY: bbox.y[1]
  }
}