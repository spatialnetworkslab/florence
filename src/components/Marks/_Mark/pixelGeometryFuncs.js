import createPixelGeometryPoint from '../Point/createPixelGeometry.js'
import createPixelGeometryRectangle from '../Rectangle/createPixelGeometry.js'
import createPixelGeometryPolygon from '../Polygon/createPixelGeometry.js'
import createPixelGeometryLine from '../Line/createPixelGeometry.js'
import createPixelGeometrySymbol from '../Symbol/createPixelGeometry.js'
import createPixelGeometryArea from '../Area/createPixelGeometry.js'

import createPixelGeometryObjectPoint from '../Point/createPixelGeometryObject.js'
import createPixelGeometryObjectRectangle from '../Rectangle/createPixelGeometryObject.js'
import createPixelGeometryObjectPolygon from '../Polygon/createPixelGeometryObject.js'
import createPixelGeometryObjectLine from '../Line/createPixelGeometryObject.js'
import createPixelGeometryObjectSymbol from '../Symbol/createPixelGeometryObject.js'
import createPixelGeometryObjectArea from '../Area/createPixelGeometryObject.js'

export const markPixelGeometryFuncs = new Proxy({
  Point: createPixelGeometryPoint,
  Rectangle: createPixelGeometryRectangle,
  Polygon: createPixelGeometryPolygon,
  Line: createPixelGeometryLine,
  Label: createPixelGeometryPoint,
  Symbol: createPixelGeometrySymbol,
  Area: createPixelGeometryArea
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      throw new Error(`Invalid Mark type: '${prop}'`)
    }
  }
})

export const layerPixelGeometryFuncs = new Proxy({
  Point: createPixelGeometryObjectPoint,
  Rectangle: createPixelGeometryObjectRectangle,
  Polygon: createPixelGeometryObjectPolygon,
  Line: createPixelGeometryObjectLine,
  Label: createPixelGeometryObjectPoint,
  Symbol: createPixelGeometryObjectSymbol,
  Area: createPixelGeometryObjectArea
}, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    } else {
      throw new Error(`Invalid Layer type: '${prop}'`)
    }
  }
})
