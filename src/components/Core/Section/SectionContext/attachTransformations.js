import { scaleLinear } from 'd3-scale'
import { createPolarTransformation } from './polar.js'

export function attachTransformations (sectionContext) {
  const {
    transformation,
    rangeX,
    rangeY,
    finalRangeX,
    finalRangeY,
    scaleX,
    scaleY,
    finalScaleX,
    finalScaleY
  } = sectionContext

  if (transformation !== 'polar') {
    sectionContext.getTotalTransformation = needsScaling => {
      const { xNeedsScaling, yNeedsScaling } = parseNeedsScaling(needsScaling)

      return ([x, y]) => ([
        finalScaleX(xNeedsScaling ? scaleX(x) : x),
        finalScaleY(yNeedsScaling ? scaleY(y) : y)
      ])
    }

    sectionContext.inverseTotalTransformation = ([x, y]) => ([
      scaleX.invert(finalScaleX.invert(x)),
      scaleY.invert(finalScaleY.invert(y))
    ])
  }

  if (transformation === 'polar') {
    const getScaleTransformation = needsScaling => {
      const { xNeedsScaling, yNeedsScaling } = parseNeedsScaling(needsScaling)

      const toTheta = scaleLinear().domain(rangeX).range([0, 2 * Math.PI])
      const toRadius = scaleLinear().domain(rangeY).range([0, 1])

      return ([x, y]) => ([
        xNeedsScaling ? scaleX(x) : toTheta(x),
        yNeedsScaling ? scaleY(y) : toRadius(y)
      ])
    }

    const postScaleTransformation = createPolarTransformation({ finalRangeX, finalRangeY })

    sectionContext.getScaleTransformation = getScaleTransformation
    sectionContext.postScaleTransformation = postScaleTransformation

    sectionContext.getTotalTransformation = needsScaling => {
      const scaleTransformation = getScaleTransformation(needsScaling)

      return point => (
        postScaleTransformation(scaleTransformation(point))
      )
    }

    const inverseScaleTransformation = ([x, y]) => ([
      scaleX.invert(x),
      scaleY.invert(y)
    ])

    sectionContext.inverseTotalTransformation = point => (
      inverseScaleTransformation(postScaleTransformation.invert(point))
    )
  }
}

function parseNeedsScaling (needsScaling) {
  if (needsScaling === undefined) {
    return {
      xNeedsScaling: true,
      yNeedsScaling: true
    }
  }

  if (needsScaling.constructor === Boolean) {
    return {
      xNeedsScaling: needsScaling,
      yNeedsScaling: needsScaling
    }
  }

  if (needsScaling.constructor === Object) {
    return needsScaling
  }
}
