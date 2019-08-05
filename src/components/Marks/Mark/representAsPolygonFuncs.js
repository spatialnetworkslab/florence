import { representPointAsPolygon, representPointsAsPolygons } from '../Point/representPointAsPolygon.js'
import { representLineAsPolygon, representLinesAsPolygons } from '../Line/representLineAsPolygon.js'

export const markRepresentAsPolygonFuncs = new Proxy({
  Point: representPointAsPolygon,
  Line: representLineAsPolygon
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      return _ => _
    }
  }
})

export const layerRepresentAsPolygonFuncs = new Proxy({
  Point: representPointsAsPolygons,
  Line: representLinesAsPolygons
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      return _ => _
    }
  }
})
