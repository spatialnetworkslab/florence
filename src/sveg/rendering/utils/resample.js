import { interpolateArray } from 'd3-interpolate'
import pointDistance from '../../utils/geometry/pointDistance.js'
import { pointIntersectsLineSegment } from '../../utils/geometry/closestPointOnLine.js'

export default function (points, transformationContext, visibilityTreshold = 1) {
  if (resamplingNecessary(transformationContext)) {
    let transform = transformationContext.transform.bind(transformationContext)
    let resampledPoints = []

    let from
    let to

    for (let i = 0; i < points.length - 1; i++) {
      let j = i + 1

      from = points[i]
      to = points[j]

      resamplePoints(from, to, transform, visibilityTreshold, resampledPoints)
    }

    resampledPoints.push(transform(to))

    return resampledPoints
  }

  return points
}

export function resamplingNecessary (transformationContext) {
  return transformationContext && transformationContext.type() !== 'cartesian'
}

function resamplePoints (from, to, transform, treshold, resampledPoints) {
  if (resamplingBetweenPointsNecessary(from, to, transform, treshold)) {
    let midPoint = interpolatePoints(from, to, 1)[0]

    resamplePoints(from, midPoint, transform, treshold, resampledPoints)
    resamplePoints(midPoint, to, transform, treshold, resampledPoints)
  } else {
    let transformedFrom = transform(from)
    resampledPoints.push(transformedFrom)
  }
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

function resamplingBetweenPointsNecessary (from, to, transform, treshold) {
  // We will sample two points between 'from' and' to' and put all 4 points in an Array.
  let pointsInBetween = interpolatePoints(from, to, 2)
  let pointsPlusPointsInBetween = [from, ...pointsInBetween, to]
  let transformedPoints = pointsPlusPointsInBetween.map(transform)

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
