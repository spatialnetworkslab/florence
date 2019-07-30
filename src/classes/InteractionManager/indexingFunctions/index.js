import { indexPoint, indexPointLayer } from './indexPoint.js'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js'
import { indexPolygon, indexPolygonLayer } from './indexPolygon.js'
import { indexSection } from './indexSection.js'

export const markIndexing = {
  Point: indexPoint,
  Rectangle: indexRectangle,
  Polygon: indexPolygon,
  Label: indexPoint
}

export const layerIndexing = {
  Point: indexPointLayer,
  Rectangle: indexRectangleLayer,
  Polygon: indexPolygonLayer,
  Label: indexPointLayer
}

export const sectionIndexing = {
  Section: indexSection
}
