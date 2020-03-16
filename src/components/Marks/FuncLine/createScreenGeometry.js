import { interpolate } from 'd3-interpolate'
import { transformGeometry } from '../../../utils/geometryUtils'
import { isDefined, isUndefined } from '../../../utils/equals.js'

export default function createScreenGeometry (
  { func, x },
  sectionContext,
  renderSettings
) {
  ensureValidInput(func, x)

  const dataPoints = generateDataPoints(
    func,
    x,
    sectionContext,
    renderSettings.interpolationTreshold
  )

  const geometry = {
    type: 'LineString',
    coordinates: dataPoints
  }

  const totalTransformation = sectionContext.getTotalTransformation()

  return transformGeometry(geometry, totalTransformation, renderSettings)
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

function generateDataPoints (func, x, sectionContext, interpolationTreshold) {
  const domainX = x || getDomainX(sectionContext)

  const finalRangeX = sectionContext.finalRangeX
  const resolution = Math.abs(finalRangeX[0] - finalRangeX[1]) / interpolationTreshold

  return interpolatePointsFromFunc(func, domainX, resolution)
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

    throw new Error('FuncLine can only be used with a scaleX that has a numeric domain')
  } else {
    return false
  }
}

function interpolatePointsFromFunc (func, domainX, resolution) {
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
