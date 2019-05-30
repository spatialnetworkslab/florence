import { interpolateArray } from 'd3-interpolate'

export function interpolate (points, transformationContext) {
  if (interpolationNecessary(transformationContext)) {
    for (let i = 0; i < points.length - 1; i++) {
      let j = i + 1

      let from = points[i]
      let to = points[j]

      // We will sample three points between 'from' and' to'.
      let pointsInBetween = interpolatePoints(from, to, 3)
      let transformedPointsInBetween = pointsInBetween.map(transformationContext.transform)

      // If the transformed points are really close together, we can skip the transformation
      if (pointsCloseTogether(transformedPointsInBetween)) continue
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

function pointsCloseTogether (points) {

}