import BaseInteractionHandler from './BaseInteractionHandler.js'
import SpatialIndex from '../SpatialIndex'

export default class MarkInteractionHandler extends BaseInteractionHandler {
  constructor (interactionManager, options) {
    super(interactionManager, options)

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

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      this._addEventListener()
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      this._removeEventListener()
    }
  }

  getId () {
    return `${this.id()}-${this._inputDevice}-mark-${this._interactionName}`
  }
}
