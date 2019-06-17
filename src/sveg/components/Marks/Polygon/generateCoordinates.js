import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'

export function generateCoordinates (
  coordinateProps, sectionContext, coordinateTransformationContext, interpolate
) {
  checkValidCombination(coordinateProps)

  let geometry = makeGeometry(coordinateProps)
  let scaledGeometry = scaleGeometry(geometry, sectionContext)
  let transformedGeometry = applyCoordinateTransformation(
    scaledGeometry,
    coordinateTransformationContext,
    interpolate
  )

  return transformedGeometry
}

function checkValidCombination (coordinateProps) {

}

function makeGeometry (coordinateProps) {

}

function scaleGeometry (geometry, sectionContext) {

}
