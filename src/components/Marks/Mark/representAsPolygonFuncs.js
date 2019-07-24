import { representPointAsPolygon, representPointsAsPolygons } from '../Point/representPointAsPolygon.js'

export const markRepresentAsPolygonFuncs = new Proxy({
  Point: representPointAsPolygon
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
