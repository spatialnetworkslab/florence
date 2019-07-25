import { representPointAsPolygon, representPointsAsPolygons } from '../Point/representPointAsPolygon.js'
import { representLineAsPolygon } from '../Line/representLineAsPolygon.js'

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
  Point: representPointsAsPolygons
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      return _ => _
    }
  }
})
