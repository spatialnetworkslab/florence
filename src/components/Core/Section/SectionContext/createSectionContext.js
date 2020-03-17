import { parsePadding } from '../../utils/padding.js'
import { getRanges, getFinalRanges } from './getRanges.js'
import { createScales, createFinalScales } from './createScales.js'
import { attachTransformations } from './attachTransformations.js'

export function createSectionContext (sectionData) {
  const padding = parsePadding(sectionData.padding)
  const ranges = getRanges(sectionData)
  const finalRanges = getFinalRanges(sectionData, ranges, padding)
  const scales = createScales(sectionData, ranges)
  const finalScales = createFinalScales(ranges, finalRanges)

  const sectionContext = constructSectionContext(
    sectionData,
    padding,
    ranges,
    finalRanges,
    scales,
    finalScales
  )

  attachTransformations(sectionContext)

  return sectionContext
}

function constructSectionContext (
  { scaleX, scaleY, padding: _, ...sectionData },
  padding,
  ranges,
  finalRanges,
  scales,
  finalScales
) {
  return {
    ...sectionData,
    padding,
    ...ranges,
    ...finalRanges,
    ...scales,
    ...finalScales,
    bbox: getBbox(ranges),
    paddedBbox: getPaddedBbox(ranges, padding)
  }
}

function getBbox ({ rangeX, rangeY }) {
  return {
    minX: Math.min(...rangeX),
    maxX: Math.max(...rangeX),
    minY: Math.min(...rangeY),
    maxY: Math.max(...rangeY)
  }
}

function getPaddedBbox ({ rangeX, rangeY }, { left, right, top, bottom }) {
  return {
    minX: Math.min(...rangeX) + left,
    maxX: Math.max(...rangeX) - right,
    minY: Math.min(...rangeY) + top,
    maxY: Math.max(...rangeY) - bottom
  }
}
