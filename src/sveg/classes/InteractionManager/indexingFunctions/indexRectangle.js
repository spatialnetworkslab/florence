import calculateBBox from '../../../utils/geometry/calculateBBox.js'

export function indexRectangle (markData) {
  let rectangleAttributes = markData.attributes

  let item = calculateBBox(rectangleAttributes.screenGeometry)

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
    let item = calculateBBox(rectangleAttributes.screenGeometry)

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
