import { interpolate } from 'd3-interpolate'
import { interpolateGeometry } from '../../../utils/geometryUtils'

export default function createScreenGeometry (func, sectionContext, coordinateTransformationContext, zoomContext) {
  const dataPoints = generateDataPoints(func, sectionContext)
  const geometry = {
    type: 'LineString',
    coordinates: dataPoints
  }
  const totalTransformation = createTotalTransformation(sectionContext, coordinateTransformationContext, zoomContext)

  return interpolateGeometry(geometry, totalTransformation)
}

function generateDataPoints (func, sectionContext) {
  const domains = getDomains(sectionContext)
  return interpolatePointsFromFunc(func, domains)
}

function getDomains (sectionContext) {
  const domains = {}

  if (isValidScale(sectionContext._scaleX)) {
    domains.x = sectionContext._scaleX.domain()
  } else {
    domains.x = sectionContext._rangeX
  }

  if (isValidScale(sectionContext._scaleY)) {
    domains.y = sectionContext._scaleY.domain()
  } else {
    domains.y = sectionContext._rangeY
  }

  return domains
}

function isValidScale (scale) {
  if (scale && scale.constructor === Function) {
    if (scale.domain && scale.domain().every(d => d.constructor === Number)) {
      return true
    }

    throw new Error('FuncLine can only be used with functions that have numeric domains')
  } else {
    return false
  }
}

function interpolatePointsFromFunc (func, domains, resolution = 100) {
  const points = []

  const interpolator = interpolate(...domains.x)

  for (let i = 0; i <= resolution; ++i) {
    const x = interpolator(i / resolution)
    const y = func(x)

    if (inDomain([x, y], domains)) {
      points.push([x, y])
    }
  }

  return points
}

function inDomain (point, domains) {
  const yMin = Math.min(...domains.y)
  const yMax = Math.max(...domains.y)
  return point[1] > yMin && point[1] < yMax
}

function createTotalTransformation (sectionContext, coordinateTransformationContext, zoomContext) {
  const { scaleX, scaleY } = sectionContext.scales()

  const sectionTransformation = ([x, y]) => ([scaleX(x), scaleY(y)])
  const coordinateTransformation = createCoordinateTransformation(coordinateTransformationContext)
  const zoomTransformation = createZoomTransformation(zoomContext)

  const totalTransformation = position => zoomTransformation(
    coordinateTransformation(
      sectionTransformation(position)
    )
  )

  return totalTransformation
}

function createCoordinateTransformation (coordinateTransformationContext) {
  if (coordinateTransformationContext) {
    return coordinateTransformationContext.transform.bind(coordinateTransformationContext)
  } else {
    return position => position
  }
}

function createZoomTransformation (zoomContext) {
  if (zoomContext) {
    return zoomContext
  } else {
    return position => position
  }
}
