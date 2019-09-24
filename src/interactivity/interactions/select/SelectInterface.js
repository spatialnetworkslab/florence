import SpatialIndex from '../SpatialIndex'
import { markIndexing, layerIndexing } from './createIndexableData'

export default class SelectInterface {
  constructor (interactionManager) {
    this._interactionManager = interactionManager

    this._selectableMarks = {}
    this._selectableLayers = {}

    this._markCallbacks = {}
    this._layerCallbacks = {}

    const getMark = function (markId) {
      return this._selectableMarks[markId]
    }

    const getLayer = function (layerId) {
      return this._selectableLayers[layerId]
    }

    this._spatialIndex = new SpatialIndex(this, getMark, getLayer)
  }

  // Loading/indexing
  loadMark (markType, markData, callback) {
    const indexingFunction = markIndexing[markType]
    const indexableMark = indexingFunction(markData)

    const markId = markData.markId

    this._selectableMarks[markId] = indexableMark
    this._markCallbacks[markId] = callback
  }

  markIsLoaded (markId) {
    return markId in this._selectableMarks
  }

  removeMark (markId) {
    delete this._selectableMarks[markId]
    delete this._markCallbacks[markId]
  }

  loadLayer (layerType, layerData, callback) {
    const indexingFunction = layerIndexing[layerType]
    const indexableLayer = indexingFunction(layerData)

    const layerId = layerData.layerId

    this._selectableLayers[layerId] = indexableLayer
    this._layerCallbacks[layerId] = callback
  }

  layerIsLoaded (layerId) {
    return layerId in this._selectableLayers
  }

  removeLayer (layerId) {
    delete this._selectableLayers[layerId]
    delete this._layerCallbacks[layerId]
  }

  // Queries
    
}
