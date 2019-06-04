import { resamplingNecessary } from '../utils/resample.js'
import { roundPoint } from '../../../utils/round.js'

export default function ({ x, y }, coordinateTransformationContext) {
  let transformedCoordinates

  if (resamplingNecessary(coordinateTransformationContext)) {
    transformedCoordinates = coordinateTransformationContext.transform([x, y])
  } else {
    transformedCoordinates = [x, y]
  }

  let rounded = roundPoint(transformedCoordinates)

  return { x: rounded[0], y: rounded[1] }
}