import { indexPoint, indexPointLayer } from './indexPoint.js'
import { indexRectangle, indexRectangleLayer } from './indexRectangle.js'
import { indexSection } from './indexSection.js'

export const markIndexing = {
  'Point': indexPoint,
  'Rectangle': indexRectangle
}

export const layerIndexing = {
  'Point': indexPointLayer,
  'Rectangle': indexRectangleLayer
}

export const sectionIndexing = {
  'Section': indexSection
}

