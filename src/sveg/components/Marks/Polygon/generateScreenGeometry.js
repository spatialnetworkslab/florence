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

const invalidCombinationError = new Error(`Polygon: Invalid combination of 'x', 'y', and 'geometry' props`)

function checkValidCombination (coordinateProps) {
  if (coordinateProps.geometry) {
    if (coordinateProps.x || coordinateProps.y) throw invalidCombinationError
  } else {
    if (!(coordinateProps.x && coordinateProps.y)) throw invalidCombinationError
  }
}

function makeGeometry (coordinateProps) {
  if (coordinateProps.geometry) {}
  if (coordinateProps.x) {}
}

function scaleGeometry (geometry, sectionContext) {

}
