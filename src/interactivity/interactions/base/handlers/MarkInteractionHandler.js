import BaseInteractionHandler from './BaseInteractionHandler.js'
import SpatialIndex from '../../SpatialIndex'

export default class MarkInteractionHandler extends BaseInteractionHandler {
  constructor (interactionManager, options) {
    super(interactionManager, options)

    const getMark = function (markId) {
      return this._interactionManager.marks()._indexableMarks[markId]
    }

    const getLayer = function (layerId) {
      return this._interactionManager.marks()._indexableLayers[layerId]
    }

    this._spatialIndex = new SpatialIndex(this, getMark, getLayer)

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

  hasMark (markId) {
    return markId in this._markCallbacks
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

  hasLayer (layerId) {
    return layerId in this._layerCallbacks
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
    return `${this.id()}-mark-${this._interactionName}`
  }
}
