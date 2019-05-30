import { scaleLinear } from 'd3-scale'

export function createPolarTransformation (rangeX, rangeY) {
  const extentY = rangeY[1] - rangeY[0]
  const halfExtentY = extentY / 2

  const toTheta = scaleLinear().domain(rangeX).range([0, 2 * Math.PI])
  const toRadius = scaleLinear().domain(rangeY).range([0, halfExtentY])

  const center = calculateCenter(rangeX, rangeY)

  return function transform ([x, y]) {
    const theta = toTheta(x)
    const radius = toRadius(y)

    const cartesian = polarToCartesian(theta, radius)

    return translate(cartesian, center)
  }
}

function calculateCenter (rangeX, rangeY) {
  const x = (rangeX[0] + rangeX[1]) / 2
  const y = (rangeY[0] + rangeY[1]) / 2

  return [x, y]
}

function polarToCartesian (theta, radius) {
  const x = radius * Math.sin(theta)
  const y = radius * Math.cos(theta)

  return [x, y]
}

function translate (point, to) {
  return [point[0] + to[0], point[1] + to[1]]
}