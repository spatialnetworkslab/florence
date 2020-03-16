import { parsePadding } from '../utils/padding.js'

export function getClipPropsNoPadding ({ x1, x2, y1, y2 }) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x1 - x2),
    height: Math.abs(y1 - y2)
  }
}

export function getClipPropsPadding ({ x1, x2, y1, y2 }, padding) {
  const { left, right, top, bottom } = parsePadding(padding)

  return {
    x: Math.min(x1, x2) + left,
    y: Math.min(y1, y2) + top,
    width: Math.abs(x1 - x2) - (left + right),
    height: Math.abs(y1 - y2) - (top + bottom)
  }
}
