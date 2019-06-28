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
    console.log('!!!')
    if (!this._sectionCallbacks.hasOwnProperty(sectionId)) {
      this._addEventListenerIfNecessary()
      this._numberOfInteractions++
      this._sectionCallbacks[sectionId] = callback
      // this._spatialIndex.loadLayer(sectionId)
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
      this._spatialIndex.loadLayer(layerId)
    }
  }

  removeLayerInteraction (layerId) {
    if (this._layerCallbacks.hasOwnProperty(layerId)) {
      this._numberOfInteractions--
      delete this._layerCallbacks[layerId]
      this._removeEventListenerIfNecessary()

      this._spatialIndex.removeLayer(layerId)
    }
  }

  // Add/remove mark interactions
  addMarkInteraction (markId, callback) {
    this._addEventListenerIfNecessary()
    this._numberOfInteractions++
    this._markCallbacks[markId] = callback

    this._spatialIndex.loadMark(markId)
  }

  removeMarkInteraction (markId) {
    this._removeEventListenerIfNecessary()
    delete this._markCallbacks[markId]
    this._numberOfInteractions--

    this._spatialIndex.removeMark(markId)
  }

  _isInSection (hit, geometry) {
    if (hit.x <= geometry.maxX && hit.x >= geometry.minX && hit.y <= geometry.maxY && hit.y >= geometry.minY) {
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
