import { representPointAsPolygon } from '../Point/representPointAsPolygon.js'

export default new Proxy({
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
