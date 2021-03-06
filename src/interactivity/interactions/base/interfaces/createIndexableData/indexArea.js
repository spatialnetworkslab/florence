import { calculateBboxGeometry } from '../../../../../utils/geometryUtils'
import createItemFromBbox from '../../../utils/createItemFromBbox.js'

export function indexArea (markData) {
  const areaAttributes = markData.attributes

  const bbox = calculateBboxGeometry(areaAttributes.screenGeometry)
  const item = createItemFromBbox(bbox)

  item.attributes = areaAttributes
  item.markType = 'Area'
  item.markId = markData.markId

  return item
}

export function indexAreaLayer ({ layerAttributes, keyArray, layerId }) {
  const items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const areaAttributes = getAreaAttributes(layerAttributes, key)
    const bbox = calculateBboxGeometry(areaAttributes.screenGeometry)
    const item = createItemFromBbox(bbox)

    item.key = key
    item.index = i
    item.attributes = areaAttributes
    item.markType = 'Area'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getAreaAttributes (layerAttributes, key) {
  return { screenGeometry: layerAttributes.screenGeometryObject[key] }
}
