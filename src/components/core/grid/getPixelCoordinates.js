import { createSection } from '@snlab/rendervous'

export default function (coordinates, parentSection) {
  const { bbox } = createSection(coordinates, parentSection)

  return {
    x1: bbox.minX,
    x2: bbox.maxX,
    y1: bbox.minY,
    y2: bbox.maxY
  }
}
