import {
  getAbsoluteXPosition,
  getAbsoluteYPosition
} from './absolutePosition.js'

export function getTitleCoordinatesXAxis (
  hjust,
  xOffset,
  vjust,
  yOffset,
  sectionContext,
  flip,
  axisHeight,
  fontSize,
  yAbsoluteAxis
) {
  const heightOffset = getHeightOffset(yOffset, flip, axisHeight, fontSize)

  const xAbsolute = getAbsoluteXPosition(hjust, xOffset, sectionContext)
  const yAbsolute = vjust === 'axis'
    ? yAbsoluteAxis + heightOffset
    : getAbsoluteYPosition(vjust, yOffset, sectionContext) + heightOffset

  const { finalScaleX, finalScaleY } = sectionContext

  const x = finalScaleX.invert(xAbsolute)
  const y = finalScaleY.invert(yAbsolute)

  return {
    x: () => x,
    y: () => y
  }
}

function getHeightOffset (offset, flip, axisHeight, fontSize) {
  if (offset === 'axis') {
    return flip
      ? -(axisHeight + 1) - fontSize
      : axisHeight + 1
  }

  if (offset.constructor !== Number) {
    throw new Error('yOffset must be a Number')
  }

  return offset
}

export function getTitleCoordinatesYAxis (
  hjust,
  xOffset,
  vjust,
  yOffset,
  sectionContext,
  flip,
  axisWidth,
  fontSize,
  xAbsoluteAxis
) {
  const widthOffset = getWidthOffset(xOffset, flip, axisWidth, fontSize)
  const xAbsolute = hjust === 'axis'
    ? xAbsoluteAxis + widthOffset
    : getAbsoluteXPosition(hjust, xOffset, sectionContext)
  const yAbsolute = getAbsoluteYPosition(vjust, yOffset, sectionContext)

  const { finalScaleX, finalScaleY } = sectionContext

  const x = finalScaleX.invert(xAbsolute)
  const y = finalScaleY.invert(yAbsolute)

  return {
    x: () => x,
    y: () => y
  }
}

function getWidthOffset (offset, flip, axisWidth, fontSize) {
  if (offset === 'axis') {
    return flip
      ? axisWidth + 5
      : -axisWidth - 5
  }

  if (offset.constructor !== Number) {
    throw new Error('xOffset must be a Number')
  }

  return offset
}
