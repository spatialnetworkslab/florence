import { getRanges, getFinalRanges } from './getRanges.js'
import { createScales, createFinalScales } from './createScales.js'
import { createPolarTransformation } from './polar.js'

export function createSectionContext (sectionData) {
  const ranges = getRanges(sectionData)
  const finalRanges = getFinalRanges(sectionData, ranges)
  const scales = createScales(sectionData, ranges)
  const finalScales = createFinalScales(ranges, finalRanges)

  const sectionContext = constructSectionContext(
    sectionData,
    ranges,
    finalRanges,
    scales,
    finalScales
  )

  const { scaleX, scaleY } = scales

  if (sectionContext.transformation !== 'polar') {
    const { finalScaleX, finalScaleY } = finalScales

    sectionContext.getTotalTransformation = needsScaling => {
      const { xNeedsScaling, yNeedsScaling } = parseNeedsScaling(needsScaling)

      return ([x, y]) => ([
        finalScaleX(xNeedsScaling ? scaleX(x) : x),
        finalScaleY(yNeedsScaling ? scaleY(y) : y)
      ])
    }
  }

  if (sectionContext.transformation === 'polar') {
    const getScaleTransformation = needsScaling => {
      const { xNeedsScaling, yNeedsScaling } = parseNeedsScaling(needsScaling)

      return ([x, y]) => ([
        xNeedsScaling ? scaleX(x) : x,
        yNeedsScaling ? scaleY(y) : y
      ])
    }

    const postScaleTransformation = createPolarTransformation(finalRanges)

    sectionContext.getScaleTransformation = getScaleTransformation
    sectionContext.postScaleTransformation = postScaleTransformation

    sectionContext.getTotalTransformation = needsScaling => {
      const scaleTransformation = getScaleTransformation(needsScaling)

      return point => (
        postScaleTransformation(scaleTransformation(point))
      )
    }
  }

  return sectionContext
}

function constructSectionContext (
  { scaleX, scaleY, ...sectionData },
  ranges,
  finalRanges,
  scales,
  finalScales
) {
  return { ...sectionData, ...ranges, ...finalRanges, ...scales, ...finalScales }
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