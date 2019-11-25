import pointCollision from './pointCollision.js'
import rectangleCollision from './rectangleCollision.js'
import polygonCollision from './polygonCollision.js'
import lineCollision from './lineCollision.js'
import symbolCollision from './symbolCollision.js'
import areaCollision from './areaCollision.js'

export default {
  Point: pointCollision,
  Rectangle: rectangleCollision,
  Polygon: polygonCollision,
  Line: lineCollision,
  Label: pointCollision,
  Symbol: symbolCollision,
  Area: areaCollision
}
