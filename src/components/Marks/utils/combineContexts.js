export default function combineContexts (
  sectionContext,
  coordinateTransformationContext,
  zoomContext
) {
  const coordinateTransformation = coordinateTransformationContext.transformation

  return {
    ...sectionContext,
    coordinateTransformation,
    zoomIdentity: zoomContext
  }
}
