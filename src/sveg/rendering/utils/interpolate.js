import { interpolateArray } from 'd3-interpolate'
import pointDistance from '../../utils/geometry/pointDistance.js'
import { pointIntersectsLineSegment } from '../../utils/geometry/closestPointOnLine.js'

export function interpolate (points, transformationContext, visibilityTreshold = 1) {
  if (interpolationNecessary(transformationContext)) {
    let interpolatedPoints = []

    for (let i = 0; i < points.length - 1; i++) {
      let j = i + 1

      let from = points[i]
      let to = points[j]

      interpolatedPoints.push(from)

      // We will sample two points between 'from' and' to'.
      let pointsInBetween = interpolatePoints(from, to, 2)
      let transformedPointsInBetween = pointsInBetween.map(transformationContext.transform)

      // If the transformed points are really close together, we can skip the interpolation
      if (pointsCloseTogether(transformedPointsInBetween, visibilityTreshold)) continue

      // If all the points are on the same line, we will also skip the interpolation
      if (pointsOnOneLine(transformedPointsInBetween, visibilityTreshold)) continue
    }
  } 
  
  return points
}

export function interpolationNecessary (transformationContext) {
  return transformationContext && transformationContext.type() !== 'cartesian'
}

function interpolatePoints (from, to, numberOfPoints) {
  const interpolator = interpolateArray(from, to)
  const points = []

  for (let i = 1; i < numberOfPoints + 1; i++) {
    let fraction = 1 / (numberOfPoints + 1) * i
    points.push(interpolator(fraction))
  }

  return points
}

function pointsCloseTogether (points, treshold) {
  let firstPoint = points[0]
  let secondPoint = points[1]
  let lastPoint = points[points.length - 1]

  return pointDistance(firstPoint, lastPoint) < treshold &&
    pointDistance(secondPoint, lastPoint < treshold)
}

function pointsOnOneLine (points, treshold) {
  let firstPoint = points[0]
  let secondPoint = points[1]
  let thirdPoint = points[2]
  let lastPoint = points[points.length - 1]

  let lineSegment = [firstPoint, lastPoint]

  return pointIntersectsLineSegment(secondPoint, lineSegment, treshold) &&
    pointIntersectsLineSegment(thirdPoint, lineSegment, treshold)
}