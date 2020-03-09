import { scaleLinear } from 'd3-scale'

export default function combineContexts (
  {
    scaleX: _scaleX,
    scaleY: _scaleY,
    rangeX,
    rangeY,
    ...sectionContext
  },
  coordinateTransformationContext,
  zoomContext,
  {
    xNeedsScaling,
    yNeedsScaling
  }
) {
  const scaleX = xNeedsScaling ? _scaleX : scaleLinear().domain(rangeX).range(rangeX)
  const scaleY = yNeedsScaling ? _scaleY : scaleLinear().domain(rangeX).range(rangeX)
  const coordinateTransformation = coordinateTransformationContext.transformation

  return {
    scaleX,
    scaleY,
    rangeX,
    rangeY,
    ...sectionContext,
    coordinateTransformation,
    zoomIdentity: zoomContext
  }
}
