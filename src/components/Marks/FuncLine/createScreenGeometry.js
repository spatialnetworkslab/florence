import { interpolate } from 'd3-interpolate'

export default function createScreenGeometry (func, sectionContext, coordinateTransformationContext, zoomContext) {
  
}

function findDomains () {
  const domains = {}

  // TODO

  return domains
}

function interpolatePointsFromFunc (func, domains, resolution = 100) {
  const points = []

  const interpolator = interpolate(...domains.x)

  for (let i = 0; i <= resolution; ++i) {
    const x = interpolator(i / resolution)
    const y = func(x)

    if (y.constructor === Number && !isNaN(y)) {
      points.push([x, y])
    } else {
      throw new Error(`FuncLine: func is only allowed to return numbers. Received '${y}'`)
    }
  }

  return points
}
