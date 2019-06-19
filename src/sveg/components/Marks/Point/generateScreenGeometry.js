import transformGeometry from '../utils/transformGeometry'

export default function (geometryProps, sectionContext, coordinateTransformationContext) {
  let scaledGeometry = createScaledGeometry(geometryProps, sectionContext)
  let screenGeometry = transformGeometry(scaledGeometry, coordinateTransformationContext)

  return screenGeometry
}

export function createScaledGeometry ({ x, y }, sectionContext) {
  const scales = sectionContext.scales()
  const { scaleX, scaleY } = scales

  const scaledX = x.constructor === Function ? x(scales) : scaleX(x)
  const scaledY = y.constructor === Function ? y(scales) : scaleY(y)

  return {
    type: 'Point',
    coordinates: [scaledX, scaledY]
  }
}
