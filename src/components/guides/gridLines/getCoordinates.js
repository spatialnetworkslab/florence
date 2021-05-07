import generateArrayOfLength from '../../../utils/generateArrayOfLength.js'

export function getCoordinatesXRaster (positions, scaleX, sectionContext) {
  const bandOffset = scaleX.bandwidth ? scaleX.bandwidth() / 2 : 0

  const x = positions.map(p => scaleX(p) + bandOffset).map(p => [p, p])
  const y = generateArrayOfLength(sectionContext.ranges.y, positions.length)

  return {
    x: () => x,
    y: () => y
  }
}

export function getCoordinatesYRaster (positions, scaleY, sectionContext) {
  const bandOffset = scaleY.bandwidth ? scaleY.bandwidth() / 2 : 0

  const x = generateArrayOfLength(sectionContext.ranges.x, positions.length)
  const y = positions.map(p => scaleY(p) + bandOffset).map(p => [p, p])

  return {
    x: () => x,
    y: () => y
  }
}
