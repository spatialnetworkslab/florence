import { markIndexing, layerIndexing } from './createIndexableData'

export default class MarkInteractionManager {
  constructor (interactionManager) {
    this._interactionManager = interactionManager

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
    // TODO
  }

  removeAllMarkInteractions (markId) {
    // TODO
  }

  // Add/remove layer interactions
  addLayerInteraction (interactionName, layerId, callback) {
    // TODO
  }

  removeAllLayerInteractions (layerId) {
    // TODO
  }
}
