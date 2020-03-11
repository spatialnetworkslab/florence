export function getLocalCoordinates (screenCoordinates, interactionManager) {
  const section = interactionManager._section
  const inverseTotalTransformation = section.inverseTotalTransformation

  const { minX, maxX, minY, maxY } = section.paddedBbox

  const clampedX = clamp(screenCoordinates.x, minX, maxX)
  const clampedY = clamp(screenCoordinates.y, minY, maxY)

  const [localX, localY] = inverseTotalTransformation([clampedX, clampedY])

  return { x: localX, y: localY }
}

export function clamp (value, min, max) {
  return Math.max(min, Math.min(value, max))
}
