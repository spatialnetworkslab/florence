import { interpolate } from 'd3-interpolate'

export default function createScreenGeometry (func, sectionContext, coordinateTransformationContext, zoomContext) {
  const domains = findDomains(sectionContext, coordinateTransformationContext, zoomContext)
  const dataPoints = interpolatePointsFromFunc(func, domains)

  return {
    type: 'LineString',
    coordinates: dataPoints
  }
}

function findDomains (sectionContext, coordinateTransformationContext, zoomContext) {
  const screenRanges = getScreenRanges(sectionContext)
  const rangeExtentsBeforeZoom = invertZoomRanges(screenRanges, zoomContext)
  const domains = getDomains(rangeExtentsBeforeZoom, sectionContext, coordinateTransformationContext)

  return domains
}

function getScreenRanges (sectionContext) {
  return {
    x: [sectionContext.x1(), sectionContext.x2()],
    y: [sectionContext.y1(), sectionContext.y2()]
  }
}

function invertZoomRanges (screenRanges, zoomContext) {
  const p0 = zoomContext.invert([screenRanges.x[0], screenRanges.y[0]])
  const p1 = zoomContext.invert([screenRanges.x[1], screenRanges.y[1]])

  return {
    x: [p0[0], p1[0]],
    y: [p0[1], p1[1]]
  }
}

function getDomains (preZoomRanges, sectionContext, coordinateTransformationContext) {
  // TODO
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
