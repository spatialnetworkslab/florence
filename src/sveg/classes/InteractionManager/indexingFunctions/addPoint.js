export function addPoint (markData) {
  let pointGeometry = markData.geometry

  let item = calculateBBox(pointGeometry)

  item.geometry = pointGeometry
  item.markType = 'Point'
  item.callbacks = markData.callbacks

  return item
}

export function addPointLayer ({ geometries, indexArray, layerId }) {
  let items = []

  for (let i = 0; i < indexArray.length; i++) {
    let $index = indexArray[i]

    let pointGeometry = getPoint(geometries, $index)
    let item = calculateBBox(pointGeometry)

    item.$index = $index
    item.geometry = pointGeometry
    item.markType = 'Point'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function calculateBBox (pointGeometry) {
  return {
    minX: pointGeometry.x - pointGeometry.radius,
    maxX: pointGeometry.x + pointGeometry.radius,
    minY: pointGeometry.y - pointGeometry.radius,
    maxY: pointGeometry.y + pointGeometry.radius
  }
}

function getPoint (layer, $index) {
  return {
    x: layer.x[$index],
    y: layer.y[$index],
    radius: layer.radius[$index]
  }
}