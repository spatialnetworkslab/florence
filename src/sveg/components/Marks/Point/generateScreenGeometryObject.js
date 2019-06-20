import transformGeometry from '../utils/transformGeometry'
import generateArrayOfLength from '../utils/generateArrayOfLength.js'
import getIndexArray from '../utils/getIndexArray.js'

export default function ({ x, y }, sectionContext, coordinateTransformationContext, indexProp) {
  let { scaledX, scaledY, length } = scaleCoordinatesLayer(x, y, sectionContext)

  let indexArray = getIndexArray(indexProp, length)

  let screenGeometryObject = transformCoordinatesLayer(scaledX, scaledY, coordinateTransformationContext, indexArray)

  return { screenGeometryObject, indexArray }
}

function scaleCoordinatesLayer (x, y, sectionContext) {
  if (x === undefined || y === undefined) throw new Error(`PointLayer: 'x' and 'y' are required`)

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

  if (isPrimitive) array = generateArrayOfLength(c, length)
  if (!isPrimitive) array = c

  if (needsScaling) return array.map(scale)
  if (!needsScaling) return array
}

function transformCoordinatesLayer (scaledX, scaledY, coordinateTransformationContext, indexArray) {
  let xObject = {}
  let yObject = {}

  for (let i = 0; i < scaledX.length; i++) {
    let transformedPoint = transformGeometry(
      [scaledX[i], scaledY[i]], 'Point', coordinateTransformationContext
    )

    let index = indexArray[i]

    xObject[index] = transformedPoint[0]
    yObject[index] = transformedPoint[1]
  }

  return { xObject, yObject }
}
