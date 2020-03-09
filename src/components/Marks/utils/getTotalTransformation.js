export default function getTotalTransformation ({
  sectionContext,
  xNeedsScaling,
  yNeedsScaling,
  coordinateTransformationContext,
  zoomTransformation
}) {
  const transformations = []

  if (scalingNeeded(xNeedsScaling, yNeedsScaling)) {
    const scaleTransformation = createScaleTransformation(
      xNeedsScaling ? sectionContext.scaleX : undefined,
      yNeedsScaling ? sectionContext.scaleY : undefined
    )

    transformations.push(scaleTransformation)
  }

  if (coordinateTransformationContext && coordinateTransformationContext.type !== 'identity') {
    transformations.push(
      coordinateTransformationContext.transformation
    )
  }

  if (zoomTransformation) {
    transformations.push(zoomTransformation.transformation)
  }

  return chainTransformations(transformations)
}

function scalingNeeded (xNeedsScaling, yNeedsScaling) {
  return xNeedsScaling === true || yNeedsScaling === true
}

export function createScaleTransformation (scaleX = x => x, scaleY = y => y) {
  return point => ([scaleX(point[0]), scaleY(point[1])])
}

function chainTransformations (transformations) {
  if (transformations.length === 0) return undefined

  if (transformations.length === 1) return transformations[0]

  if (transformations.length === 2) {
    return point => transformations[1](transformations[0](point))
  }

  if (transformations.length === 3) {
    return point => {
      return transformations[2](transformations[1](transformations[0](point)))
    }
  }
}
