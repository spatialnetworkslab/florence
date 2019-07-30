import pointCollision from './pointCollision.js'
import rectangleCollision from './rectangleCollision.js'
import polygonCollision from './polygonCollision.js'

export default {
  Point: pointCollision,
  Rectangle: rectangleCollision,
  Polygon: polygonCollision,
  Label: pointCollision
}
