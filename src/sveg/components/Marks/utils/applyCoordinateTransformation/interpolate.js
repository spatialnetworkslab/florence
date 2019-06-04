import { interpolateArray } from 'd3-interpolate'
import pointDistance from '../../../../utils/geometry/pointDistance.js'
import { pointIntersectsLineSegment } from '../../../../utils/geometry/closestPointOnLine.js'

export function pointArray (points, transformFunc, visibilityTreshold) {
  let interpolatedPoints = []

  let from
  let to

  for (let i = 0; i < points.length - 1; i++) {
    let j = i + 1

    from = points[i]
    to = points[j]

    interpolatePointPair(from, to, transformFunc, visibilityTreshold, interpolatedPoints)
  }

  interpolatedPoints.push(transformFunc(to))

  return interpolatedPoints
}

function interpolatePointPair (from, to, transformFunc, treshold, resampledPoints) {
  if (interpolationBetweenPointsNecessary(from, to, transformFunc, treshold)) {
    let midPoint = interpolateNPoints(from, to, 1)[0]

    interpolatePointPair(from, midPoint, transformFunc, treshold, resampledPoints)
    interpolatePointPair(midPoint, to, transformFunc, treshold, resampledPoints)
  } else {
    let transformedFrom = transformFunc(from)
    resampledPoints.push(transformedFrom)
  }
}

function interpolateNPoints (from, to, numberOfPoints) {
  const interpolator = interpolateArray(from, to)
  const points = []

  for (let i = 1; i < numberOfPoints + 1; i++) {
    let fraction = 1 / (numberOfPoints + 1) * i
    points.push(interpolator(fraction))
  }

  return points
}

function interpolationBetweenPointsNecessary (from, to, transformFunc, treshold) {
  // We will sample two points between 'from' and' to' and put all 4 points in an Array.
  let pointsInBetween = interpolateNPoints(from, to, 2)
  let pointsPlusPointsInBetween = [from, ...pointsInBetween, to]
  let transformedPoints = pointsPlusPointsInBetween.map(transformFunc)

  // If the transformed points are really close together, we can skip the resampling
  if (pointsCloseTogether(transformedPoints, treshold)) return false

  // If all the points are on the same line, we will also skip the resampling
  if (pointsOnOneLine(transformedPoints, treshold)) return false

  return true
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