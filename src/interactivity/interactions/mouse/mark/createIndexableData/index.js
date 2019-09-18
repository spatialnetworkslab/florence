import { indexPoint, indexPointLayer } from './indexPoint.js.js'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js.js'
import { indexPolygon, indexPolygonLayer } from './indexPolygon.js.js'
import { indexLine, indexLineLayer } from './indexLine.js.js'

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
