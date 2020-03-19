import { calculateBboxGeometry } from '../../../../../utils/geometryUtils'
import createItemFromBbox from '../../../utils/createItemFromBbox.js'

export function indexLine (markData) {
  const lineAttributes = markData.attributes
  const markId = markData.markId

  const pixelGeometry = lineAttributes.pixelGeometry
  const lineStringCoords = pixelGeometry.coordinates

  if (pixelGeometry.type === 'LineString') {
    return indexLineString(lineStringCoords, lineAttributes, markId)
  }

  if (pixelGeometry.type === 'MultiLineString') {
    return indexMultiLineString(lineStringCoords, lineAttributes, markId)
  }
}

function indexLineString (lineStringCoords, lineAttributes, markId, lineStringIndex) {
  const indexableSegments = []

  for (let i = 0; i < lineStringCoords.length - 1; i++) {
    const segment = [lineStringCoords[i], lineStringCoords[i + 1]]

    const item = createSegmentItem(segment, lineAttributes, i)
    if (lineStringIndex) {
      // Only for MultiLineStrings
      item.lineStringIndex = lineStringIndex
    }
    item.markId = markId
    indexableSegments.push(item)
  }

  return indexableSegments
}

function indexMultiLineString (lineStringCoords, lineAttributes, markId) {
  let indexableSegments = []

  for (let lineStringIndex = 0; lineStringIndex < lineStringCoords.length; lineStringIndex++) {
    indexableSegments = indexableSegments.concat(indexLineString(
      lineStringCoords[lineStringIndex], lineAttributes, markId, lineStringIndex
    ))
  }

  return indexableSegments
}

function createSegmentItem (segment, attributes, i) {
  const segmentGeometry = { type: 'LineString', coordinates: segment }
  const bbox = calculateBboxGeometry(segmentGeometry)
  let item = createItemFromBbox(bbox)
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

export function indexLineLayer ({ layerAttributes, keyArray, layerId }) {
  let items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]
    const lineAttributes = createLineAttributes(layerAttributes, key)
    const pixelGeometry = lineAttributes.pixelGeometry
    const lineStringCoords = pixelGeometry.coordinates

    if (pixelGeometry.type === 'LineString') {
      let segments = indexLineString(
        lineStringCoords, lineAttributes, key
      )

      segments = modifyForLayer(segments, layerId, key, i)
      items = items.concat(segments)
    }

    if (pixelGeometry.type === 'MultiLineString') {
      let segments = indexMultiLineString(
        lineStringCoords, lineAttributes, key
      )

      segments = modifyForLayer(segments, layerId, key, i)
      items = items.concat(segments)
    }
  }

  return items
}

function createLineAttributes (attributes, key) {
  return {
    pixelGeometry: attributes.pixelGeometryObject[key],
    strokeWidth: attributes.strokeWidthObject[key]
  }
}

function modifyForLayer (segments, layerId, key, index) {
  for (let i = 0; i < segments.length; i++) {
    const segmentItem = segments[i]
    delete segmentItem.markId

    segmentItem.layerId = layerId
    segmentItem.key = key
    segmentItem.index = index
  }

  return segments
}
