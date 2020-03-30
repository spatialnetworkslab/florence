import { applyPadding } from '../../utils/padding.js'

export function getRanges ({ coordinates }) {
  return {
    rangeX: [coordinates.x1, coordinates.x2],
    rangeY: [coordinates.y1, coordinates.y2]
  }
}

export function getFinalRanges (sectionContext, ranges, padding) {
  const { flipX, flipY, zoomIdentity } = sectionContext
  const { rangeX, rangeY } = ranges
  const { left, right, top, bottom } = padding

  let finalRangeX = applyFlip(rangeX, flipX)
  finalRangeX = applyPadding(finalRangeX, left, right)

  if (zoomIdentity) {
    validateZoomFactor(zoomIdentity.kx)
    finalRangeX = applyZoom(finalRangeX, zoomIdentity.kx, zoomIdentity.x)
  }

  let finalRangeY = applyFlip(rangeY, flipY)
  finalRangeY = applyPadding(finalRangeY, top, bottom)

  if (zoomIdentity) {
    validateZoomFactor(zoomIdentity.ky)
    finalRangeY = applyZoom(finalRangeY, zoomIdentity.ky, zoomIdentity.y)
  }

  return { finalRangeX, finalRangeY }
}

function applyFlip (range, flip) {
  return flip
    ? [range[1], range[0]]
    : range
}

function applyZoom (range, k, translate) {
  return [
    range[0] * k + translate,
    range[1] * k + translate
  ]
}

function validateZoomFactor (k) {
  if (k < 0) throw new Error('Zoom factors have to be positive')
}
