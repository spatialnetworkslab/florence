import { scaleLinear } from 'd3-scale'

export function createPolarTransformation (rangeX, rangeY) {
  const toTheta = scaleLinear().domain(rangeX).range([0, 2 * Math.PI]).clamp(true)
  const toRadius = scaleLinear().domain(rangeY).range([0, 1]).clamp(true)

  const fitX = scaleLinear().domain([-1, 1]).range(rangeX)
  const fitY = scaleLinear().domain([-1, 1]).range(rangeY)

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

// function cartesianToPolar (x, y) {
//   const r = Math.sqrt(y ** 2 + x ** 2)
//   const theta = Math.atan(x / y)

//   return [theta, r]
// }

// function cartesianToPolar (x, y) {
//   const theta = Math.PI + arcctg(y / x)
//   const radius = x / Math.sin(theta)

//   return [theta, radius]
// }

// const arcctg = x => Math.PI / 2 - Math.atan(x)
