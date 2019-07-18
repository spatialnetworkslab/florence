import { calculateBBoxGeometry } from 'geometryUtils'
import createItemFromBBox from './utils/createItemFromBBox.js'

export function indexPolygon (markData) {
  const polygonAttributes = markData.attributes

  const bbox = calculateBBoxGeometry(polygonAttributes.screenGeometry)
  const item = createItemFromBBox(bbox)

  item.attributes = polygonAttributes
  item.markType = 'Polygon'
  item.markId = markData.markId

  return item
}

export function indexPolygonLayer () {}
