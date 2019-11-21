import createCoordSysGeometryPoint from '../Point/createCoordSysGeometry.js'
import createCoordSysGeometryRectangle from '../Rectangle/createCoordSysGeometry.js'
import createCoordSysGeometryPolygon from '../Polygon/createCoordSysGeometry.js'
import createCoordSysGeometryLine from '../Line/createCoordSysGeometry.js'
import createCoordSysGeometrySymbol from '../Symbol/createCoordSysGeometry.js'

import createCoordSysGeometryObjectPoint from '../Point/createCoordSysGeometryObject.js'
import createCoordSysGeometryObjectRectangle from '../Rectangle/createCoordSysGeometryObject.js'
import createCoordSysGeometryObjectPolygon from '../Polygon/createCoordSysGeometryObject.js'
import createCoordSysGeometryObjectLine from '../Line/createCoordSysGeometryObject.js'
// import createCoordSysGeometryObjectSymbol from '../Symbol/createCoordSysGeometryObject.js'

export const markCoordSysGeometryFuncs = new Proxy({
  Point: createCoordSysGeometryPoint,
  Rectangle: createCoordSysGeometryRectangle,
  Polygon: createCoordSysGeometryPolygon,
  Line: createCoordSysGeometryLine,
  Label: createCoordSysGeometryPoint,
  Symbol: createCoordSysGeometrySymbol
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      throw new Error(`Invalid Mark type: '${prop}'`)
    }
  }
})

export const layerCoordSysGeometryFuncs = new Proxy({
  Point: createCoordSysGeometryObjectPoint,
  Rectangle: createCoordSysGeometryObjectRectangle,
  Polygon: createCoordSysGeometryObjectPolygon,
  Line: createCoordSysGeometryObjectLine,
  Label: createCoordSysGeometryObjectPoint
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      throw new Error(`Invalid Layer type: '${prop}'`)
    }
  }
})
