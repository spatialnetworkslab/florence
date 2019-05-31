import { resamplingNecessary } from '../utils/resample.js'

export default function ({ x, y }, coordinateContext, transformationContext) {
  const scales = coordinateContext.scales()
  const { scaleX, scaleY } = scales

  const scaledX = x.constructor === Function ? x(scales) : scaleX(x)
  const scaledY = y.constructor === Function ? y(scales) : scaleY(y)

  let pixelCoords

  if (resamplingNecessary(transformationContext)) {
    pixelCoords = transformationContext.transform([scaledX, scaledY])
  } else {
    pixelCoords = [scaledX, scaledY]
  }

  return pixelCoords.map(c => round(c, 2))
}

function round (value, decimals) {
  const multiplier = 10 ** decimals
  return Math.floor(value * multiplier) / multiplier
}
