import createCoordSysGeometryPoint from '../Point/createCoordSysGeometry.js'
import createCoordSysGeometryRectangle from '../Rectangle/createCoordSysGeometry.js'
import createCoordSysGeometryPolygon from '../Polygon/createCoordSysGeometry.js'

export default new Proxy({
  Point: createCoordSysGeometryPoint,
  Rectangle: createCoordSysGeometryRectangle,
  Polygon: createCoordSysGeometryPolygon
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      throw new Error(`Invalid Mark type: '${prop}'`)
    }
  }
})
