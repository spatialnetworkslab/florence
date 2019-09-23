import BaseInteractionInterface from './BaseInteractionInterface.js'
import { markIndexing, layerIndexing } from './createIndexableData'

export default class MarkInteractionInterface extends BaseInteractionInterface {
  constructor (interactionManager, InteractionHandlers) {
    super(interactionManager, InteractionHandlers)

    this._indexableMarks = {}
    this._indexableLayers = {}
  }

  // Mark loading and removing
  loadMark (markType, markData) {
    const indexingFunction = markIndexing[markType]
    const indexableMark = indexingFunction(markData)

    const markId = markData.markId
    this._indexableMarks[markId] = indexableMark
  }

  markIsLoaded (markId) {
    return markId in this._indexableMarks
  }

  removeMark (markId) {
    delete this._indexableMarks[markId]
  }

  // Layer loading and removing
  loadLayer (layerType, layerData) {
    const indexingFunction = layerIndexing[layerType]
    const indexableLayer = indexingFunction(layerData)

    const layerId = layerData.layerId
    this._indexableLayers[layerId] = indexableLayer
  }

  layerIsLoaded (layerId) {
    return layerId in this._indexableLayers
  }

  removeLayer (layerId) {
    delete this._indexableLayers[layerId]
  }

  // Add/remove mark interactions
  addMarkInteraction (interactionName, markId, callback) {
    this._getHandler(interactionName).addMarkInteraction(markId, callback)
  }

  removeAllMarkInteractions (markId) {
    for (const handlerName in this._handlers) {
      const handler = this._handlers[handlerName]

      if (handler.hasMark(markId)) {
        handler.removeMarkInteraction(markId)
      }
    }
  }

  // Add/remove layer interactions
  addLayerInteraction (interactionName, layerId, callback) {
    this._getHandler(interactionName).addLayerInteraction(layerId, callback)
  }

  removeAllLayerInteractions (layerId) {
    for (const handlerName in this._handlers) {
      const handler = this._handlers[handlerName]

      if (handler.hasLayer(layerId)) {
        handler.removeLayerInteraction(layerId)
      }
    }
  }
}
