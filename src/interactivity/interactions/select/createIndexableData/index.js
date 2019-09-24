import { indexPoint, indexPointLayer } from '../../base/interfaces/createIndexableData'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js'
import { indexPolygon, indexPolygonLayer } from './indexPolygon.js'
import { indexLine, indexLineLayer } from './indexLine.js'

export const markIndexing = {
  Point: indexPoint,
  Rectangle: indexRectangle,
  Polygon: indexPolygon,
  Line: indexLine,
  Label: indexPoint
}

export const layerIndexing = {
  Point: indexPointLayer,
  Rectangle: indexRectangleLayer,
  Polygon: indexPolygonLayer,
  Line: indexLineLayer,
  Label: indexPointLayer
}
