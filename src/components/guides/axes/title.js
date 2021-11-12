import { parseHJust, parseVJust } from './just.js'

export function getTitleCoordinatesXAxis (
  hjust,
  xOffset,
  vjust,
  yOffset,
  section,
  flip,
  axisHeight,
  fontSize,
  yAbsoluteAxis
) {
  const heightOffset = getHeightOffset(yOffset, flip, axisHeight, fontSize)

  const xAbs = parseHJust(hjust, xOffset, section.paddedBbox)
  const yAbs = vjust === 'axis'
    ? yAbsoluteAxis + heightOffset
    : parseVJust(vjust, yOffset, section.paddedBbox) + heightOffset

  return {
    x: ({ pxAt }) => pxAt(xAbs),
    y: ({ pyAt }) => pyAt(yAbs)
  }
}

function getHeightOffset (offset, flip, axisHeight, fontSize) {
  if (offset === 'axis') {
    return flip
      ? -(axisHeight + 1) - fontSize
      : axisHeight + 1
  }

  if (offset.constructor !== Number) {
    throw new Error('yOffset must be a Number or \'axis\'')
  }

  return offset
}

export function getTitleCoordinatesYAxis (
  hjust,
  xOffset,
  vjust,
  yOffset,
  section,
  flip,
  axisWidth,
  fontSize,
  xAbsoluteAxis
) {
  const widthOffset = getWidthOffset(xOffset, flip, axisWidth, fontSize)

  const xAbs = hjust === 'axis'
    ? xAbsoluteAxis + widthOffset
    : parseHJust(hjust, xOffset, section.paddedBbox)
  const yAbs = parseVJust(vjust, yOffset, section.paddedBbox)

  return {
    x: ({ pxAt }) => pxAt(xAbs),
    y: ({ pyAt }) => pyAt(yAbs)
  }
}

function getWidthOffset (offset, flip, axisWidth, fontSize) {
  if (offset === 'axis') {
    return flip
      ? axisWidth + 5
      : -axisWidth - 5
  }

  if (offset.constructor !== Number) {
    throw new Error('xOffset must be a Number or \'axis\'')
  }

  return offset
}
