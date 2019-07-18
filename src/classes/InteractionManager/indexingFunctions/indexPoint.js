export function indexPoint (markData) {
  const pointAttributes = markData.attributes

  const item = calculateBBoxPoint(pointAttributes)

  item.attributes = pointAttributes
  item.markType = 'Point'
  item.markId = markData.markId

  return item
}

export function indexPointLayer ({ layerAttributes, indexArray, layerId }) {
  const items = []

  for (let i = 0; i < indexArray.length; i++) {
    const $index = indexArray[i]

    const pointAttributes = getPointAttributes(layerAttributes, $index)
    const item = calculateBBoxPoint(pointAttributes)

    item.$index = $index
    item.attributes = pointAttributes
    item.markType = 'Point'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function calculateBBoxPoint (pointAttributes) {
  const x = pointAttributes.screenGeometry.coordinates[0]
  const y = pointAttributes.screenGeometry.coordinates[1]

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
