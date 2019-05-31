import { scaleLinear } from 'd3-scale'

export function createPolarTransformation (rangeX, rangeY) {
  const toTheta = scaleLinear().domain(rangeX).range([0, 2 * Math.PI])
  const toRadius = scaleLinear().domain(rangeY).range([0, 1])

  const fitX = scaleLinear().domain([-1, 1]).range(rangeX)
  const fitY = scaleLinear().domain([-1, 1]).range(rangeY)

  return function transform ([x, y]) {
    const theta = toTheta(x)
    const radius = toRadius(y)
    const coords = polarToCartesian(theta, radius)

    return [fitX(coords[0]), fitY(coords[1])]
  }
}

function polarToCartesian (theta, radius) {
  const x = radius * Math.sin(theta)
  const y = radius * Math.cos(theta)

  return [x, y]
}
