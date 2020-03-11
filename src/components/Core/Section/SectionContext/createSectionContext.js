import { getRanges, getFinalRanges } from './getRanges.js'
import { createScales, createFinalScales } from './createScales.js'
import { createPolarTransformation } from './polar.js'

export function createSectionContext (sectionData) {
  const ranges = getRanges(sectionData)
  const finalRanges = getFinalRanges(sectionData, ranges)
  const scales = createScales(sectionData, ranges)

  const sectionContext = constructSectionContext(
    sectionData,
    ranges,
    finalRanges,
    scales
  )

  const { scaleX, scaleY } = scales

  if (sectionContext.transformation !== 'polar') {
    const { finalScaleX, finalScaleY } = createFinalScales(ranges, finalRanges)

    sectionContext.totalTransformation = ([x, y], { xNeedsScaling, yNeedsScaling }) => ([
      finalScaleX(scaleX(x, xNeedsScaling)),
      finalScaleY(scaleY(y, yNeedsScaling))
    ])
  }

  if (sectionContext.transformation === 'polar') {
    const scaleTransformation = ([x, y], { xNeedsScaling, yNeedsScaling }) => ([
      scaleX(x, xNeedsScaling),
      scaleY(y, yNeedsScaling)
    ])

    const postScaleTransformation = createPolarTransformation(finalRanges)

    sectionContext.scaleTransformation = scaleTransformation
    sectionContext.postScaleTransformation = postScaleTransformation
    sectionContext.totalTransformation = (point, needsScalingObj) => (
      postScaleTransformation(scaleTransformation(point, needsScalingObj))
    )
  }

  return sectionContext
}

function constructSectionContext (
  { scaleX, scaleY, ...sectionData },
  ranges,
  finalRanges,
  scales
) {
  return { ...sectionData, ...ranges, ...finalRanges, ...scales }
}
