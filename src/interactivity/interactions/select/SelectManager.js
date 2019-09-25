import SpatialIndex from '../SpatialIndex'
import { markIndexing, layerIndexing } from './createIndexableData'
import { hitIsMark, hitIsInLayer, getHitId } from '../utils/hitUtils.js'
import { createSelectMarkEvent, createSelectLayerEvent } from '../utils/createEvent.js'

export default class SelectManager {
  constructor () {
    this._selectableMarks = {}
    this._selectableLayers = {}

    this._markCallbacks = {}
    this._layerCallbacks = {}

    this._previousSelection = {}
    this._currentSelection = {}

    const getMark = function (markId) {
      return this._selectableMarks[markId]
    }

    const getLayer = function (layerId) {
      return this._selectableLayers[layerId]
    }

    this._spatialIndex = new SpatialIndex(this, getMark, getLayer)
  }

  // Loading/indexing
  loadMark (markType, markData, callbacks) {
    const indexingFunction = markIndexing[markType]
    const indexableMark = indexingFunction(markData)

    const markId = markData.markId

    this._selectableMarks[markId] = indexableMark
    this._markCallbacks[markId] = callbacks

    this._spatialIndex.indexMark(markId)
  }

  markIsLoaded (markId) {
    return markId in this._selectableMarks
  }

  removeMark (markId) {
    this._spatialIndex.unindexMark(markId)

    delete this._selectableMarks[markId]
    delete this._markCallbacks[markId]
  }

  loadLayer (layerType, layerData, callbacks) {
    const indexingFunction = layerIndexing[layerType]
    const indexableLayer = indexingFunction(layerData)

    const layerId = layerData.layerId

    this._selectableLayers[layerId] = indexableLayer
    this._layerCallbacks[layerId] = callbacks

    this._spatialIndex.indexLayer(layerId)
  }

  layerIsLoaded (layerId) {
    return layerId in this._selectableLayers
  }

  removeLayer (layerId) {
    this._spatialIndex.unindexLayer(layerId)

    delete this._selectableLayers[layerId]
    delete this._layerCallbacks[layerId]
  }

  // Queries
  selectRectangle (rectangle) {
    this._previousSelection = {}
    this._currentSelection = {}

    const hits = this._spatialIndex.queryBoundingBox(rectangleToRBushBBox(rectangle))

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = getHitId(hit)

      this._currentSelection[hitId] = hit

      this._fireSelectCallback(hit)
    }
  }

  updateSelectRectangle (rectangle) {
    this._previousSelection = this._currentSelection
    this._currentSelection = {}

    const hits = this._spatialIndex.queryBoundingBox(rectangleToRBushBBox(rectangle))

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = getHitId(hit)

      this._currentSelection[hitId] = hit

      if (!(hitId in this._previousSelection)) {
        this._fireSelectCallback(hit)
      }
    }

    for (const hitId in this._previousSelection) {
      if (!(hitId in this._currentSelection)) {
        const hit = this._previousSelection[hitId]

        this._fireDeselectCallback(hit)
      }
    }
  }

  resetSelection () {
    for (const hitId in this._currentSelection) {
      const hit = this._currentSelection[hitId]

      this._fireDeselectCallback(hit)
    }

    this._previousSelection = {}
    this._currentSelection = {}
  }

  _fireSelectCallback (hit) {
    if (hitIsMark(hit)) {
      const selectEvent = createSelectMarkEvent('select', hit)
      const callback = this._markCallbacks[hit.markId].onSelect

      if (callback) callback(selectEvent)
    }

    if (hitIsInLayer(hit)) {
      const selectEvent = createSelectLayerEvent('select', hit)
      const callback = this._layerCallbacks[hit.layerId].onSelect

      if (callback) callback(selectEvent)
    }
  }

  _fireDeselectCallback (hit) {
    if (hitIsMark(hit)) {
      const deselectEvent = createSelectMarkEvent('deselect', hit)
      const callback = this._markCallbacks[hit.markId].onDeselect

      if (callback) callback(deselectEvent)
    }

    if (hitIsInLayer(hit)) {
      const deselectEvent = createSelectLayerEvent('deselect', hit)
      const callback = this._layerCallbacks[hit.layerId].onDeselect

      if (callback) callback(deselectEvent)
    }
  }
}

function rectangleToRBushBBox (rectangle) {
  return {
    minX: Math.min(rectangle.x1, rectangle.x2),
    maxX: Math.max(rectangle.x1, rectangle.x2),
    minY: Math.min(rectangle.y1, rectangle.y2),
    maxY: Math.max(rectangle.y1, rectangle.y2)
  }
}
