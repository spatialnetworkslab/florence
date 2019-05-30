import { scaleLinear } from 'd3-scale'

export function createPolarTransformation (rangeX, rangeY) {
  const toTheta = scaleLinear().domain(rangeX).range([0, 2 * Math.PI])
  const newRange = [rangeY[0] - rangeY[1], rangeY[1]]

  const fitX = scaleLinear().domain(newRange).range(rangeX)
  const fitY = scaleLinear().domain(newRange).range(rangeY)

  return function transform ([x, y]) {
    const theta = toTheta(x)
    const radius = y
    const coords = polarToCartesian(theta, radius)

    return [fitX(coords[0]), fitY(coords[1])]
  }
}

function polarToCartesian (theta, radius) {
  const x = radius * Math.sin(theta)
  const y = radius * Math.cos(theta)

  return [x, y]
}
