import calculateBBox from '../../../utils/geometry/calculateBBox.js'

export function indexRectangle (markData) {
  let rectangleGeometry = markData.geometry

  let item = calculateBBox('LineString', rectangleGeometry)

  item.geometry = rectangleGeometry
  item.markType = 'Rectangle'
  item.markId = markData.markId

  return item
}

export function indexRectangleLayer ({ geometries, indexArray, layerId }) {
  let items = []

  for (let i = 0; i < indexArray.length; i++) {
    let $index = indexArray[i]

    let rectangleGeometry = geometries[$index]
    let item = calculateBBox('LineString', rectangleGeometry)

    item.$index = $index
    item.geometry = rectangleGeometry
    item.markType = 'Rectangle'
    item.layerId = layerId

    items.push(item)
  }

  return items
}
