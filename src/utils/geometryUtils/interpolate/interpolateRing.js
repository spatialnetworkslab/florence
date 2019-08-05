import { interpolateArray } from 'd3-interpolate'
import { pointDistance, pointIntersectsLineSegment } from '../index.js'

export default function (points, transformFunc, visibilityTreshold) {
  const interpolatedPoints = []

  let from
  let to

  for (let i = 0; i < points.length - 1; i++) {
    const j = i + 1

    from = points[i]
    to = points[j]

    interpolatePointPair(from, to, transformFunc, visibilityTreshold, interpolatedPoints)
  }

  interpolatedPoints.push(transformFunc(to))

  return interpolatedPoints
}

function interpolatePointPair (from, to, transformFunc, treshold, resampledPoints) {
  if (interpolationBetweenPointsNecessary(from, to, transformFunc, treshold)) {
    const midPoint = interpolateNPoints(from, to, 1)[0]

    interpolatePointPair(from, midPoint, transformFunc, treshold, resampledPoints)
    interpolatePointPair(midPoint, to, transformFunc, treshold, resampledPoints)
  } else {
    const transformedFrom = transformFunc(from)
    resampledPoints.push(transformedFrom)
  }
}

function interpolateNPoints (from, to, numberOfPoints) {
  const interpolator = interpolateArray(from, to)
  const points = []

  for (let i = 1; i < numberOfPoints + 1; i++) {
    const fraction = 1 / (numberOfPoints + 1) * i
    points.push(interpolator(fraction))
  }

  return points
}

function interpolationBetweenPointsNecessary (from, to, transformFunc, treshold) {
  // We will sample two points between 'from' and' to' and put all 4 points in an Array.
  const pointsInBetween = interpolateNPoints(from, to, 2)
  const pointsPlusPointsInBetween = [from, ...pointsInBetween, to]
  const transformedPoints = pointsPlusPointsInBetween.map(transformFunc)

  // If the transformed points are really close together, we can skip the interpolation
  if (pointsCloseTogether(transformedPoints, treshold)) return false

  // If all the points are on the same line, we will also skip the interpolation
  if (pointsOnOneLine(transformedPoints, treshold)) return false

  return true
}

function pointsCloseTogether (points, treshold) {
  const firstPoint = points[0]
  const secondPoint = points[1]
  const lastPoint = points[points.length - 1]

  return pointDistance(firstPoint, lastPoint) < treshold &&
    pointDistance(secondPoint, lastPoint < treshold)
}

function pointsOnOneLine (points, treshold) {
  const firstPoint = points[0]
  const secondPoint = points[1]
  const thirdPoint = points[2]
  const lastPoint = points[points.length - 1]

  const lineSegment = [firstPoint, lastPoint]

  return pointIntersectsLineSegment(secondPoint, lineSegment, treshold) &&
    pointIntersectsLineSegment(thirdPoint, lineSegment, treshold)
}
