import { calculateCentroid } from '../../../../utils/geometryUtils'
import bboxPoint from './utils/bboxPoint.js'
import createItemFromBbox from '../../utils/createItemFromBbox.js'

export function indexLine (markData) {
  const lineAttributes = markData.attributes

  const centroid = calculateCentroid(lineAttributes.pixelGeometry)
  const bbox = bboxPoint(centroid)
  const item = createItemFromBbox(bbox)

  item.attributes = lineAttributes
  item.markType = 'Line'
  item.markId = markData.markId

  return item
}

export function indexLineLayer ({ layerAttributes, keyArray, layerId }) {
  const items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const lineAttributes = getLineAttributes(layerAttributes, key)

    const centroid = calculateCentroid(lineAttributes.screenGeometry)
    const bbox = bboxPoint(centroid)
    const item = createItemFromBbox(bbox)

    item.key = key
    item.index = i
    item.attributes = lineAttributes
    item.markType = 'Line'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getLineAttributes (layerAttributes, key) {
  return { screenGeometry: layerAttributes.pixelGeometryObject[key] }
}
