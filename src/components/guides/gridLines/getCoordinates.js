export function getCoordinatesXRaster (positions) {
  return {
    x: ({ scaleX, bwx }) => {
      const bandOffset = bwx ? bwx() / 2 : 0
      return positions.map(t => scaleX(t) + bandOffset).map(t => [t, t])
    },
    y: ({ pyAt, paddedBbox }) => {
      const y1 = pyAt(paddedBbox.minY)
      const y2 = pyAt(paddedBbox.maxY)
      return Array(positions.length).fill([y1, y2])
    }
  }
}

export function getCoordinatesYRaster (positions) {
  return {
    x: ({ pxAt, paddedBbox }) => {
      const x1 = pxAt(paddedBbox.minX)
      const x2 = pxAt(paddedBbox.maxX)
      return Array(positions.length).fill([x1, x2])
    },
    y: ({ scaleY, bwy }) => {
      const bandOffset = bwy ? bwy() / 2 : 0
      return positions.map(t => scaleY(t) + bandOffset).map(t => [t, t])
    }
  }
}
