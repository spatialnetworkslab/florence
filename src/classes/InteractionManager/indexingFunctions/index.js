import { indexPoint, indexPointLayer } from './indexPoint.js'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js'
import { indexSection } from './indexSection.js'
import { indexPolygon, indexPolygonLayer } from './indexPolygon.js'

export const markIndexing = {
  Point: indexPoint,
  Rectangle: indexRectangle,
  Polygon: indexPolygon
}

export const layerIndexing = {
  Point: indexPointLayer,
  Rectangle: indexRectangleLayer,
  Polygon: indexPolygonLayer
}

export const sectionIndexing = {
  'Section': indexSection
}

