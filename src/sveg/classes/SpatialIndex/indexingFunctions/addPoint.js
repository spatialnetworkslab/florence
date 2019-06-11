export function addPoint (point, $index) {
  let item = calculateBBox(point)
  item.$index = $index

  return item
}

export function addPointLayer (layer, indexArray) {
  let items = []

  for (let i = 0; i < indexArray.length; i++) {
    let $index = indexArray[i]

    let point = getPoint(layer, $index)
    let item = calculateBBox(point)
    item.$index = $index

    items.push(item)
  }

  return items
}

function calculateBBox (point) {
  return {
    minX: point.x - point.radius,
    maxX: point.x + point.radius,
    minY: point.y - point.radius,
    maxY: point.y + point.radius
  }
}

function getPoint (layer, $index) {
  return {
    x: layer.x[$index],
    y: layer.y[$index],
    radius: layer.radius[$index]
  }
}