export function getSectionPositioning (
  width,
  height,
  containerWidth,
  containerHeight
) {
  if (width.constructor === Number && height.constructor === Number) {
    return {
      x1: 0,
      x2: width,
      y1: 0,
      y2: height
    }
  }

  if (containerWidth === undefined || containerHeight === undefined) return

  return {
    x1: 0,
    x2: containerWidth,
    y1: 0,
    y2: containerHeight
  }
}

export function sectionPositioningEqual (a, b) {
  if (!a || !b) return false
  return a.x2 === b.x2 && a.y2 === b.y2
}
