import { indexPoint, indexPointLayer } from './indexPoint.js'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js'
import { indexPolygon, indexPolygonLayer } from './indexPolygon.js'
import { indexLine, indexLineLayer } from './indexLine.js'
import { indexArea, indexAreaLayer } from './indexArea.js'

export const markIndexing = {
  Point: indexPoint,
  Rectangle: indexRectangle,
  Polygon: indexPolygon,
  Line: indexLine,
  Label: indexPoint,
  Area: indexArea
}

export const layerIndexing = {
  Point: indexPointLayer,
  Rectangle: indexRectangleLayer,
  Polygon: indexPolygonLayer,
  Line: indexLineLayer,
  Label: indexPointLayer,
  Area: indexAreaLayer
}
