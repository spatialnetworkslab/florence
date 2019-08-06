import { interpolate } from 'd3-interpolate'
import { interpolateGeometry } from '../../../utils/geometryUtils'
import { isDefined, isUndefined } from '../../../utils/equals.js'

export default function createScreenGeometry ({ func, x }, sectionContext, coordinateTransformationContext, zoomContext) {
  ensureValidInput(func, x)

  const dataPoints = generateDataPoints(func, x, sectionContext)
  const geometry = {
    type: 'LineString',
    coordinates: dataPoints
  }
  const totalTransformation = createTotalTransformation(sectionContext, coordinateTransformationContext, zoomContext)

  return interpolateGeometry(geometry, totalTransformation)
}

function ensureValidInput (func, x) {
  if (func.constructor === Function && isUndefined(x)) return
  if (func.constructor === Function && isDefined(x)) {
    if (x.constructor === Array && x.length === 2 && x.every(d => d.constructor === Number)) {
      return
    }
  }

  throw new Error('FuncLine: invalid positioning props')
}

function generateDataPoints (func, x, sectionContext) {
  const domainX = x || getDomainX(sectionContext)
  return interpolatePointsFromFunc(func, domainX)
}

function getDomainX (sectionContext) {
  let domainX

  if (isValidScale(sectionContext._scaleX)) {
    domainX = sectionContext._scaleX.domain()
  } else {
    domainX = sectionContext._rangeX
  }

  return domainX
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

function interpolatePointsFromFunc (func, domainX, resolution = 100) {
  const points = []

  const interpolator = interpolate(...domainX)

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
