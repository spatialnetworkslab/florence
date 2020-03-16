import { calculateBboxGeometry } from '../../../../../utils/geometryUtils'
import createItemFromBbox from '../../../utils/createItemFromBbox.js'

export function indexSymbol (markData) {
  const symbolAttributes = markData.attributes

  const bbox = calculateBboxGeometry(symbolAttributes.screenGeometry)
  const item = createItemFromBbox(bbox)

  item.attributes = symbolAttributes
  item.markType = 'Symbol'
  item.markId = markData.markId

  return item
}

export function indexSymbolLayer ({ layerAttributes, keyArray, layerId }) {
  const items = []

  for (let i = 0; i < keyArray.length; i++) {
    const key = keyArray[i]

    const symbolAttributes = getSymbolAttributes(layerAttributes, key)
    const bbox = calculateBboxGeometry(symbolAttributes.screenGeometry)
    const item = createItemFromBbox(bbox)

    item.key = key
    item.index = i
    item.attributes = symbolAttributes
    item.markType = 'Symbol'
    item.layerId = layerId

    items.push(item)
  }

  return items
}

function getSymbolAttributes (layerAttributes, key) {
  return { screenGeometry: layerAttributes.screenGeometryObject[key] }
}
