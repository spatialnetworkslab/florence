import { calculateBBoxGeometry } from 'geometryUtils'
import createItemFromBBox from './utils/createItemFromBBox.js'

export function indexLine (markData) {
  const lineAttributes = markData.attributes
  const markId = markData.markId

  const pixelGeometry = lineAttributes.pixelGeometry
  const lineStringCoords = pixelGeometry.coordinates

  const indexableSegments = []

  for (let i = 0; i < lineStringCoords.length - 1; i++) {
    const segment = [lineStringCoords[i], lineStringCoords[i + 1]]

    const item = createSegmentItem(segment, lineAttributes, i)
    item.markId = markId
    indexableSegments.push(item)
  }

  return indexableSegments
}

function createSegmentItem (segment, attributes, i) {
  const segmentGeometry = { type: 'LineString', coordinates: segment }
  const bbox = calculateBBoxGeometry(segmentGeometry)
  let item = createItemFromBBox(bbox)
  item = takeIntoAccountStrokeWidth(item, attributes.strokeWidth)

  item.attributes = {}
  item.attributes.strokeWidth = attributes.strokeWidth
  item.attributes.segmentGeometry = segmentGeometry
  item.markType = 'Line'
  item.segmentIndex = i

  return item
}

function takeIntoAccountStrokeWidth (item, strokeWidth) {
  const halfStrokeWidth = strokeWidth / 2

  const newBbox = {
    minX: item.minX - halfStrokeWidth,
    maxX: item.maxX + halfStrokeWidth,
    minY: item.minY - halfStrokeWidth,
    maxY: item.maxY + halfStrokeWidth
  }

  return Object.assign(item, newBbox)
}

export function indexLineLayer ({ layerAttributes, indexArray, layerId }) {
  const items = []

  for (let i = 0; i < indexArray.length; i++) {
    const $index = indexArray[i]
    const lineAttributes = createLineAttributes(layerAttributes, $index)
    const pixelGeometry = lineAttributes.pixelGeometry
    const lineStringCoords = pixelGeometry.coordinates

    for (let j = 0; j < lineStringCoords.length - 1; j++) {
      const segment = [lineStringCoords[j], lineStringCoords[j + 1]]

      const item = createSegmentItem(segment, lineAttributes, j)
      item.$index = $index
      item.layerId = layerId

      items.push(item)
    }
  }

  return items
}

function createLineAttributes (attributes, $index) {
  return {
    pixelGeometry: attributes.pixelGeometryObject[$index],
    strokeWidth: attributes.strokeWidthObject[$index]
  }
}
