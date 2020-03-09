export function getLocalCoordinates (screenCoordinates, interactionManager) {
  const section = interactionManager._section

  const coordinateTransformation = interactionManager._coordinateTransformation
    ? interactionManager._coordinateTransformation._transformation
    : undefined

  const zoom = interactionManager._zoom
    ? interactionManager._zoom.transformation
    : undefined

  const { scaleX, scaleY } = section

  const clampedX = clamp(screenCoordinates.x, section.minX, section.maxX)
  const clampedY = clamp(screenCoordinates.y, section.minY, section.maxY)

  let localX = clampedX
  let localY = clampedY

  if (zoom) {
    [localX, localY] = zoom.invert([localX, localY])
  }

  if (coordinateTransformation) {
    [localX, localY] = coordinateTransformation.invert([localX, localY])
  }

  localX = scaleX.invert(localX)
  localY = scaleY.invert(localY)

  return { x: localX, y: localY }
}

export function clamp (value, min, max) {
  return Math.max(min, Math.min(value, max))
}
