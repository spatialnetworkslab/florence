import SpatialIndex from '../SpatialIndex.js'

export default class InteractionHandler {
  constructor (interactionManager) {
    this._spatialIndex = new SpatialIndex(interactionManager)

    this._interactionManager = interactionManager
    this._numberOfInteractions = 0
    this._layerCallbacks = {}
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
  addMarkInteraction (markId) {
    this._addEventListenerIfNecessary()
    this._numberOfInteractions++

    this._spatialIndex.loadMark(markId)
  }

  removeMarkInteraction (markId) {
    this._removeEventListenerIfNecessary()
    this._numberOfInteractions--

    this._spatialIndex.removeMark(markId)
  }

  _isInLayer (hit) {
    return hit.hasOwnProperty('layerId')
  }

  _isMark (hit) {
    return hit.hasOwnProperty('callbacks')
  }
}
