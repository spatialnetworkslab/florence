export default function combineContexts (
  sectionContext,
  coordinateTransformationContext,
  zoomContext
) {
  return {
    ...sectionContext,
    coordinateTransformation: coordinateTransformationContext.transform.bind(coordinateTransformationContext),
    zoomIdentity: zoomContext
  }
}
