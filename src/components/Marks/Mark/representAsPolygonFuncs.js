import { representPointAsPolygon, representPointsAsPolygons } from '../Point/representPointAsPolygon.js'
import { representLineAsPolygon, representLinesAsPolygons } from '../Line/representLineAsPolygon.js'

export const markRepresentAsPolygonFuncs = {
  Point: representPointAsPolygon,
  Line: representLineAsPolygon
}

export const layerRepresentAsPolygonFuncs = {
  Point: representPointsAsPolygons,
  Line: representLinesAsPolygons
}
