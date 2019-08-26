import { createZoomFunction } from '../../../components/Core/Section/ZoomContext'

export default class SectionInteractionHandler {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._callback = undefined
  }

  // Add/remove layer interactions
  addSectionInteraction (callback) {
    this._callback = callback
    this._addEventListener()
  }

  removeSectionInteraction () {
    this._removeEventListener()
    this._callback = undefined
  }

  _isInSection (hit, geometry) {
    return (hit.x >= geometry.x1 &&
            hit.x <= geometry.x2 &&
            hit.y >= geometry.y1 &&
            hit.y <= geometry.y2)
  }

  _getLocalCoordinates (pixelCoords) {
    const im = this._interactionManager
    const section = im._section

    const coordinateTransformation = im._coordinateTransformation
      ? im._coordinateTransformation._transformation
      : undefined
    const zoom = im._zoom
      ? createZoomFunction(im._zoom)
      : undefined

    const { scaleX, scaleY } = section

    const clampedX = this._clamp(pixelCoords.x, section.x1, section.x2)
    const clampedY = this._clamp(pixelCoords.y, section.y1, section.y2)

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

  _clamp (coord, min, max) {
    return Math.max(min, Math.min(coord, max))
  }
}
