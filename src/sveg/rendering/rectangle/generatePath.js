import { line } from 'd3-shape'

const pathGenerator = line()

export default function (coordinates) {
  const points = generatePoints(coordinates)
  return pathGenerator(points)
}

function generatePoints ({ x, w, y, h }) {
  let x1 = x
  let x2 = x + w
  let y1 = y
  let y2 = y + h

  return [
    [x1, y1],
    [x1, y2],
    [x2, y2],
    [x2, y1],
    [x1, y1]
  ]
}