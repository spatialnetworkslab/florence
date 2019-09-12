import SpatialIndex from '../SpatialIndex.js'
import { createZoomFunction } from '../../../components/Core/Section/ZoomContext'

export default class InteractionHandler {
  constructor (interactionManager) {
    this._spatialIndex = new SpatialIndex(interactionManager)

    this._interactionManager = interactionManager
    this._numberOfInteractions = 0

    this._layerCallbacks = {}
    this._markCallbacks = {}
  }

  // Add/remove layer interactions
  addLayerInteraction (layerId, callback) {
    if (!(layerId in this._layerCallbacks)) {
      this._addEventListenerIfNecessary()
      this._numberOfInteractions++
      this._layerCallbacks[layerId] = callback

      this._spatialIndex.indexLayer(layerId)
    }
  }

  removeLayerInteraction (layerId) {
    if (layerId in this._layerCallbacks) {
      this._numberOfInteractions--
      delete this._layerCallbacks[layerId]
      this._removeEventListenerIfNecessary()

      this._spatialIndex.unindexLayer(layerId)
    }
  }

  // Add/remove mark interactions
  addMarkInteraction (markId, callback) {
    this._addEventListenerIfNecessary()
    this._numberOfInteractions++
    this._markCallbacks[markId] = callback

    this._spatialIndex.indexMark(markId)
  }

  removeMarkInteraction (markId) {
    this._removeEventListenerIfNecessary()
    delete this._markCallbacks[markId]
    this._numberOfInteractions--

    this._spatialIndex.unindexMark(markId)
  }

  _isInSection (hit) {
    const section = this._interactionManager._section
    return (hit.x >= section.minX &&
            hit.x <= section.maxX &&
            hit.y >= section.minY &&
            hit.y <= section.maxY)
  }

  _isInLayer (hit) {
    return 'layerId' in hit
  }

  _isMark (hit) {
    return 'markId' in hit
  }

  _getLocalCoordinates (screenCoordinates) {
    const im = this._interactionManager
    const section = im._section

    const coordinateTransformation = im._coordinateTransformation
      ? im._coordinateTransformation._transformation
      : undefined
    const zoom = im._zoom
      ? createZoomFunction(im._zoom)
      : undefined

    const { scaleX, scaleY } = section

    const clampedX = this._clamp(screenCoordinates.x, section.minX, section.maxX)
    const clampedY = this._clamp(screenCoordinates.y, section.minY, section.maxY)

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
