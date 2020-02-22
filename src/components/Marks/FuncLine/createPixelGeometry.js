import { interpolate } from 'd3-interpolate'
import { transformGeometry } from '../../../utils/geometryUtils'
import getTotalTransformation from '../utils/getTotalTransformation'
import { isDefined, isUndefined } from '../../../utils/equals.js'
import { warn } from '../../../utils/logging.js'

export default function createPixelGeometry (
  { func, x },
  sectionContext,
  coordinateTransformationContext,
  zoomTransformation,
  renderSettings
) {
  ensureValidInput(func, x)

  const dataPoints = generateDataPoints(func, x, sectionContext)

  const geometry = {
    type: 'LineString',
    coordinates: dataPoints
  }

  const totalTransformation = getTotalTransformation({
    sectionContext,
    xNeedsScaling: true,
    yNeedsScaling: true,
    coordinateTransformationContext,
    zoomTransformation
  })

  if (geometryCompletelyOffScreen(geometry, totalTransformation, sectionContext)) {
    warn('FuncLine was completely out of Section window. Please check your Section settings and FuncLine props.')
    return {
      type: 'LineString',
      coordinates: [[0, 0], [0, 1]]
    }
  }

  return transformGeometry(geometry, totalTransformation, { interpolate: true })
}

function ensureValidInput (func, x) {
  if (func.constructor === Function && isUndefined(x)) return
  if (func.constructor === Function && isDefined(x)) {
    if (x.constructor === Array && x.length === 2 && x.every(d => d.constructor === Number)) {
      return
    }
  }

  throw new Error('FuncLine: invalid geometry props')
}

function generateDataPoints (func, x, sectionContext) {
  const domainX = x || getDomainX(sectionContext)
  return interpolatePointsFromFunc(func, domainX)
}

function getDomainX (sectionContext) {
  let domainX

  if (isValidScale(sectionContext.scaleX)) {
    domainX = sectionContext.scaleX.domain()
  } else {
    domainX = sectionContext.rangeX
  }

  return domainX
}

function isValidScale (scale) {
  if (scale && scale.constructor === Function && scale.name !== '') {
    if (scale.domain && scale.domain().every(d => d.constructor === Number)) {
      return true
    }

    throw new Error('FuncLine can only be used with functions that have numeric domains')
  } else {
    return false
  }
}

function interpolatePointsFromFunc (func, domainX, resolution = 10) {
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

function geometryCompletelyOffScreen (geometry, totalTransformation, sectionContext) {
  const transformedGeometry = transformGeometry(geometry, totalTransformation)

  for (let i = 0; i < transformedGeometry.coordinates.length; i++) {
    const point = transformedGeometry.coordinates[i]
    if (pointIsInRange(point, sectionContext)) return false
  }

  return true
}

function pointIsInRange (point, s) {
  return (
    point[0] >= s.minX &&
    point[0] <= s.maxX &&
    point[1] >= s.minY &&
    point[1] <= s.maxY
  )
}
