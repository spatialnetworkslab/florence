import { line } from 'd3-shape'

const pathGenerator = line()

export default function (points) {
  return pathGenerator(points)
}
