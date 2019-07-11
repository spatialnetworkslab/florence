export function indexPoint (markData) {
  let pointAttributes = markData.attributes

  let item = calculateBBoxPoint(pointAttributes)

  item.attributes = pointAttributes
  item.markType = 'Point'
  item.markId = markData.markId

  return item
}

export function indexPointLayer ({ layerAttributes, indexArray, layerId }) {
  let items = []

  for (let i = 0; i < indexArray.length; i++) {
    let $index = indexArray[i]

    let pointAttributes = getPointAttributes(layerAttributes, $index)
    let item = calculateBBoxPoint(pointAttributes)

    item.$index = $index
    item.attributes = pointAttributes
    item.markType = 'Point'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function calculateBBoxPoint (pointAttributes) {
  let x = pointAttributes.screenGeometry.coordinates[0]
  let y = pointAttributes.screenGeometry.coordinates[1]

  return {
    minX: x - pointAttributes.radius,
    maxX: x + pointAttributes.radius,
    minY: y - pointAttributes.radius,
    maxY: y + pointAttributes.radius
  }
}

function getPointAttributes (layerAttributes, $index) {
  return {
    screenGeometry: layerAttributes.screenGeometryObject[$index],
    radius: layerAttributes.radiusObject[$index]
  }
}
