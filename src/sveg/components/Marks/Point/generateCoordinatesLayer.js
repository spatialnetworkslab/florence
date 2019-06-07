import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'
import { generatePropArray } from '../utils/generatePropArray.js'

export function generateCoordinatesLayer ({ x, y }, sectionContext, coordinateTransformationContext) {
  let { scaledX, scaledY, length } = scaleCoordinatesLayer(x, y, sectionContext)
  let { transformedX, transformedY } = transformCoordinatesLayer(scaledX, scaledY, coordinateTransformationContext)

  return { xArray: transformedX, yArray: transformedY, length }
}

function scaleCoordinatesLayer (x, y, sectionContext) {
  if (!x || !y) throw new Error(`PointLayer: 'x' and 'y' are required`)

  const scales = sectionContext.scales()

  let xNeedsScaling = x.constructor !== Function
  let yNeedsScaling = y.constructor !== Function

  let xValue = x.constructor === Function ? x(scales) : x
  let yValue = y.constructor === Function ? y(scales) : y

  let length = getNPoints(xValue, yValue)

  let xIsPrimitive = xValue.constructor !== Array
  let yIsPrimitive = yValue.constructor !== Array

  let scaledX = scaleCoordinate(xValue, scales.scaleX, xNeedsScaling, xIsPrimitive, length)
  let scaledY = scaleCoordinate(yValue, scales.scaleY, yNeedsScaling, yIsPrimitive, length)

  return { scaledX, scaledY, length }
}

function getNPoints (x, y) {
  if (x.constructor !== Array && y.constructor !== Array) {
    throw new Error(`PointLayer: at least 'x' or 'y' must evaluate to an Array`)
  }

  let length = x.constructor === Array ? x.length : y.length

  if (x.constructor === Array && y.constructor === Array) {
    if (x.length !== length || y.length !== length) {
      throw new Error(`PointLayer: 'x' and 'y' have different lengths`)
    }
  }

  return length
}

function scaleCoordinate (c, scale, needsScaling, isPrimitive, length) {
  let array

  if (isPrimitive) array = generatePropArray(c, length)
  if (!isPrimitive) array = c

  if (needsScaling) return array.map(scale)
  if (!needsScaling) return array
}

function transformCoordinatesLayer (scaledX, scaledY, coordinateTransformationContext) {
  let transformedX = []
  let transformedY = []

  for (let i = 0; i < scaledX.length; i++) {
    let transformedPoint = applyCoordinateTransformation(
      [scaledX[i], scaledY[i]], coordinateTransformationContext
    )

    transformedX.push(transformedPoint[0])
    transformedY.push(transformedPoint[1])
  }

  return { transformedX, transformedY }
}
