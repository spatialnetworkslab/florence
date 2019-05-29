import { line } from 'd3-shape'

const pathGenerator = line()

export default function (coordinates) {
  const points = generatePoints(coordinates)
  return pathGenerator(points)
}

function generatePoints ({ x1, x2, y1, y2 }) {
  return [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1],
    [x1, y1]
  ]
}