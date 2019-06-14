export default class InteractionHandler {
  constructor (interactionManager) {
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
    }
  }

  removeLayerInteraction (layerId) {
    if (this._layerCallbacks.hasOwnProperty(layerId)) {
      this._numberOfInteractions--
      delete this._layerCallbacks[layerId]

      this._removeEventListenerIfNecessary()
    }
  }

  // Add/remove mark interactions
  addMarkInteraction () {
    this._addEventListenerIfNecessary()
    this._numberOfInteractions++
  }

  removeMarkInteraction () {
    this._removeEventListenerIfNecessary()
    this._numberOfInteractions--
  }

  _isInLayer (hit) {
    return hit.hasOwnProperty('layerId')
  }

  _isMark (hit) {
    return hit.hasOwnProperty('callbacks')
  }
}
