export function getLocalCoordinates (screenCoordinates, interactionManager) {
  const section = interactionManager._section
  const inverseTotalTransformation = section.inverseTotalTransformation

  const clampedX = clamp(screenCoordinates.x, section.minX, section.maxX)
  const clampedY = clamp(screenCoordinates.y, section.minY, section.maxY)

  const [localX, localY] = inverseTotalTransformation([clampedX, clampedY])

  return { x: localX, y: localY }
}

export function clamp (value, min, max) {
  return Math.max(min, Math.min(value, max))
}
