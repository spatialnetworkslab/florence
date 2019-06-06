import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'

export function generateCoordinates ({ x, y }, sectionContext, coordinateTransformationContext) {
  let scaledCoordinates = scaleCoordinates({ x, y }, sectionContext)

  let transformedCoordinates = applyCoordinateTransformation(
    [scaledCoordinates.x, scaledCoordinates.y], coordinateTransformationContext
  )

  return transformedCoordinates
}

export function scaleCoordinates ({ x, y }, sectionContext) {
  const scales = sectionContext.scales()
  const { scaleX, scaleY } = scales

  const scaledX = x.constructor === Function ? x(scales) : scaleX(x)
  const scaledY = y.constructor === Function ? y(scales) : scaleY(y)

  return { x: scaledX, y: scaledY }
}
