export default function (bbox) {
  return {
    minX: bbox.x[0],
    maxX: bbox.x[1],
    minY: bbox.y[0],
    maxY: bbox.y[1]
  }
}
