import { calculateBBoxGeometry } from '../../../../../utils/geometryUtils'
import createItemFromBBox from '../../../utils/createItemFromBBox.js'

export function indexSymbol (markData) {
  const symbolAttributes = markData.attributes

  const bbox = calculateBBoxGeometry(symbolAttributes.screenGeometry)
  const item = createItemFromBBox(bbox)

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
    const bbox = calculateBBoxGeometry(symbolAttributes.screenGeometry)
    const item = createItemFromBBox(bbox)

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
