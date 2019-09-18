import pointCollision from './pointCollision.js'
import rectangleCollision from './rectangleCollision.js'
import polygonCollision from './polygonCollision.js'
import lineCollision from './lineCollision.js'

export default {
  Point: pointCollision,
  Rectangle: rectangleCollision,
  Polygon: polygonCollision,
  Line: lineCollision,
  Label: pointCollision
}
