export default function combineContexts (
  sectionContext,
  zoomContext
) {
  return { ...sectionContext, ...zoomContext }
}
