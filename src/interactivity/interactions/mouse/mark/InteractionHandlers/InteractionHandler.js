import SpatialIndex from '../SpatialIndex/SpatialIndex.js'

export default class InteractionHandler {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._spatialIndex = new SpatialIndex(interactionManager)

    this._numberOfInteractions = 0

    this._markCallbacks = {}
    this._layerCallbacks = {}
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

  interactionManager () {
    return this._interactionManager
  }

  eventManager () {
    return this._interactionManager._eventManager
  }

  section () {
    return this._interactionManager._section
  }
}
