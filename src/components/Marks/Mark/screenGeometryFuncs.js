import { representPointAsPolygon, representPointsAsPolygons } from '../Point/representPointAsPolygon.js'

export const markScreenGeometryFuncs = new Proxy({
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

export const layerScreenGeometryFuncs = new Proxy({
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
