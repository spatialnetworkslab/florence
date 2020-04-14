export function indexPoint (markData) {
  const pointAttributes = markData.attributes

  const item = calculateBboxPoint(pointAttributes)

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
    const item = calculateBboxPoint(pointAttributes)

    item.key = key
    item.index = i
    item.attributes = pointAttributes
    item.markType = 'Point'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function calculateBboxPoint (pointAttributes) {
  const x = pointAttributes.pixelGeometry.coordinates[0]
  const y = pointAttributes.pixelGeometry.coordinates[1]

  return {
    minX: x - pointAttributes.radius,
    maxX: x + pointAttributes.radius,
    minY: y - pointAttributes.radius,
    maxY: y + pointAttributes.radius
  }
}

function getPointAttributes (layerAttributes, key) {
  return {
    pixelGeometry: layerAttributes.pixelGeometryObject[key],
    radius: layerAttributes.radiusObject[key]
  }
}
