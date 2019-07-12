import SpatialIndex from '../SpatialIndex.js'

export default class InteractionHandler {
  constructor (interactionManager) {
    this._spatialIndex = new SpatialIndex(interactionManager)

    this._interactionManager = interactionManager
    this._numberOfInteractions = 0

    this._sectionCallbacks = {}
    this._layerCallbacks = {}
    this._markCallbacks = {}
  }

  // Add/remove layer interactions
  addSectionInteraction (sectionId, callback) {
    if (!this._sectionCallbacks.hasOwnProperty(sectionId)) {
      this._addEventListenerIfNecessary()
      this._numberOfInteractions++
      this._sectionCallbacks[sectionId] = callback
    }
  }

  removeSectionInteraction (sectionId) {
    if (this._sectionCallbacks.hasOwnProperty(sectionId)) {
      this._numberOfInteractions--
      delete this._sectionCallbacks[sectionId]
      this._removeEventListenerIfNecessary()

      // this._spatialIndex.removeLayer(sectionId)
    }
  }

  // Add/remove layer interactions
  addLayerInteraction (layerId, callback) {
    if (!this._layerCallbacks.hasOwnProperty(layerId)) {
      this._addEventListenerIfNecessary()
      this._numberOfInteractions++
      this._layerCallbacks[layerId] = callback

      this._spatialIndex.indexLayer(layerId)
    }
  }

  removeLayerInteraction (layerId) {
    if (this._layerCallbacks.hasOwnProperty(layerId)) {
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

  _isInSection (hit, geometry) {
    if (hit.x <= geometry.x2 && hit.x >= geometry.x1 && hit.y <= geometry.y2 && hit.y >= geometry.y1) {
      return true
    }
    return false
  }

  _isInLayer (hit) {
    return hit.hasOwnProperty('layerId')
  }

  _isMark (hit) {
    return hit.hasOwnProperty('markId')
  }
}
