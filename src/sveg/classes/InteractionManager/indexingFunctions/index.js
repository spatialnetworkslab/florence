import { indexPoint, indexPointLayer } from './indexPoint.js'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js'

export const markIndexing = {
  'Point': indexPoint,
  'Rectangle': indexRectangle
}

export const layerIndexing = {
  'Point': indexPointLayer,
  'Rectangle': indexRectangleLayer
}
