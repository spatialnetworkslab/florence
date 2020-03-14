import {
  getAbsoluteXPosition,
  getAbsoluteYPosition
} from './absolutePosition.js'

export function getTitleCoordinates (
  hjust,
  xOffset,
  vjust,
  yOffset,
  sectionContext
) {
  const xAbsolute = getAbsoluteXPosition(hjust, xOffset, sectionContext)
  const yAbsolute = getAbsoluteYPosition(vjust, yOffset, sectionContext)

  const { finalScaleX, finalScaleY } = sectionContext

  const x = finalScaleX.invert(xAbsolute)
  const y = finalScaleY.invert(yAbsolute)

  return {
    x: () => x,
    y: () => y
  }
}
