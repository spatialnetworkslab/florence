import propNeedsScaling from '../../Marks/utils/propNeedsScaling.js'

export function getPixelCoordinates ({ x1, x2, y1, y2 }, sectionContext) {
  if (sectionContext.transformation) {
    throw new Error('Cannot nest coordinate transformations')
  }

  const x1NeedsScaling = propNeedsScaling(x1)
  const x2NeedsScaling = propNeedsScaling(x2)
  const y1NeedsScaling = propNeedsScaling(y1)
  const y2NeedsScaling = propNeedsScaling(y2)

  const totalTransformation1 = sectionContext.getTotalTransformation({
    xNeedsScaling: x1NeedsScaling,
    yNeedsScaling: y1NeedsScaling
  })

  const totalTransformation2 = sectionContext.getTotalTransformation({
    xNeedsScaling: x2NeedsScaling,
    yNeedsScaling: y2NeedsScaling
  })

  const [x1Scaled, y1Scaled] = totalTransformation1([x1, y1])
  const [x2Scaled, y2Scaled] = totalTransformation2([x2, y2])

  return {
    x1: x1Scaled,
    x2: x2Scaled,
    y1: y1Scaled,
    y2: y2Scaled
  }
}
