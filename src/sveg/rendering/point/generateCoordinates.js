import { resamplingNecessary } from '../utils/resample.js'
import { roundPoint } from '../../utils/round.js'

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

  return roundPoint(pixelCoords)
}
