import { getRanges, getFinalRanges } from './getRanges.js'
import { createScales, createFinalScales } from './createScales.js'
import { applyTransformations } from './applyTransformations.js'

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

  applyTransformations(sectionContext)

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
