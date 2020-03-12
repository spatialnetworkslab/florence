import { scaleLinear } from 'd3-scale'

export function createPolarTransformation (
  { rangeX, rangeY },
  { finalRangeX, finalRangeY }
) {
  const toTheta = scaleLinear().domain(rangeX).range([0, 2 * Math.PI])
  const toRadius = scaleLinear().domain(rangeY).range([0, 1])

  const fitX = scaleLinear().domain([-1, 1]).range(finalRangeX)
  const fitY = scaleLinear().domain([-1, 1]).range(finalRangeY)

  const transform = function transform ([x, y]) {
    const theta = toTheta(x)
    const radius = toRadius(y)
    const coords = polarToCartesian(theta, radius)

    return [fitX(coords[0]), fitY(coords[1])]
  }

  const invert = function invert ([x, y]) {
    const smallCoords = [fitX.invert(x), fitY.invert(y)]
    const [theta, radius] = cartesianToPolar(...smallCoords)

    return [toTheta.invert(theta), toRadius.invert(radius)]
  }

  transform.invert = invert

  return transform
}

function polarToCartesian (theta, radius) {
  const x = radius * Math.sin(theta)
  const y = radius * Math.cos(theta)

  return [x, y]
}

// https://www.mathsisfun.com/polar-cartesian-coordinates.html
function cartesianToPolar (x, y) {
  const quadrant = getQuadrant(x, y)

  const r = Math.sqrt(y ** 2 + x ** 2)
  let theta = Math.atan(x / y)

  if (quadrant === 2) {
    theta += Math.PI * 2
  }

  if (quadrant === 3) {
    theta += Math.PI
  }

  if (quadrant === 4) {
    theta += Math.PI
  }

  return [theta, r]
}

function getQuadrant (x, y) {
  if (x >= 0 && y >= 0) return 1
  if (x < 0 && y >= 0) return 2
  if (x < 0 && y < 0) return 3
  if (x >= 0 && y < 0) return 4
}
