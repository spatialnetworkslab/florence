import { calculateBBoxGeometry } from 'geometryUtils'
import createItemFromBBox from './utils/createItemFromBBox.js'

export function indexPolygon (markData) {
  let polygonAttributes = markData.attributes

  let bbox = calculateBBoxGeometry(polygonAttributes.screenGeometry)
  let item = createItemFromBBox(bbox)

  item.attributes = polygonAttributes
  item.markType = 'Polygon'
  item.markId = markData.markId

  return item
}

export function indexPolygonLayer () {}
