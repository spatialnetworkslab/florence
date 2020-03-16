import SpatialIndex from '../SpatialIndex'
import { markIndexing, layerIndexing } from './createIndexableData'
import { hitIsMark, hitIsInLayer, getHitId } from '../utils/hitUtils.js'
import { createSelectMarkEvent, createSelectLayerEvent } from '../utils/createEvent.js'
import { calculateBboxGeometry, pointInPolygon } from '../../../utils/geometryUtils'

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

    this._selectPolygon = { start: undefined, points: [] }
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

  // Rectangle
  selectRectangle (rectangle) {
    const hits = this._spatialIndex.queryBoundingBox(rectangleToRBushBbox(rectangle))

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

    const hits = this._spatialIndex.queryBoundingBox(rectangleToRBushBbox(rectangle))

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

  resetSelectRectangle () {
    for (const hitId in this._currentSelection) {
      const hit = this._currentSelection[hitId]

      this._fireDeselectCallback(hit)
    }

    this._previousSelection = {}
    this._currentSelection = {}
  }

  // Polygon
  startSelectPolygon (startCoordinates) {
    this._selectPolygon.start = parseCoordinates(startCoordinates)
  }

  addPointToSelectPolygon (coordinates) {
    this._selectPolygon.points.push(parseCoordinates(coordinates))

    if (this._selectPolygon.points.length > 1) {
      const lastThreePointsPolygon = this._getLastThreePointsPolygon()
      const bbox = calculateBboxGeometry(lastThreePointsPolygon)

      const hits = this._spatialIndex.queryBoundingBox(bboxToRBushBbox(bbox))

      for (let i = 0; i < hits.length; i++) {
        const hit = hits[i]
        const hitCentroid = [hit.minX, hit.minY]

        if (pointInPolygon(hitCentroid, lastThreePointsPolygon)) {
          const hitId = getHitId(hit)

          if (hitId in this._currentSelection) {
            this._fireDeselectCallback(hit)
            delete this._currentSelection[hitId]
          } else {
            this._fireSelectCallback(hit)
            this._currentSelection[hitId] = hit
          }
        }
      }
    }
  }

  moveSelectPolygon (_delta) {
    this._previousSelection = this._currentSelection
    this._currentSelection = {}

    const delta = parseCoordinates(_delta)

    const start = this._selectPolygon.start
    const points = this._selectPolygon.points

    this._selectPolygon.start = [start[0] + delta[0], start[1] + delta[1]]
    this._selectPolygon.points = points.map(point => [point[0] + delta[0], point[1] + delta[1]])

    const polygon = this.getSelectPolygon()
    const bbox = calculateBboxGeometry(polygon)

    const hits = this._spatialIndex.queryBoundingBox(bboxToRBushBbox(bbox))

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitCentroid = [hit.minX, hit.minY]

      if (pointInPolygon(hitCentroid, polygon)) {
        const hitId = getHitId(hit)

        this._currentSelection[hitId] = hit

        if (!(hitId in this._previousSelection)) {
          this._fireSelectCallback(hit)
        }
      }
    }

    for (const hitId in this._previousSelection) {
      if (!(hitId in this._currentSelection)) {
        const hit = this._previousSelection[hitId]

        this._fireDeselectCallback(hit)
      }
    }
  }

  getSelectPolygon () {
    if (this._selectPolygon.start) {
      return {
        type: 'Polygon',
        coordinates: [[
          this._selectPolygon.start,
          ...this._selectPolygon.points,
          this._selectPolygon.start
        ]]
      }
    }
  }

  resetSelectPolygon () {
    for (const hitId in this._currentSelection) {
      const hit = this._currentSelection[hitId]

      this._fireDeselectCallback(hit)
    }

    this._selectPolygon = { start: undefined, points: [] }
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

  _getLastThreePointsPolygon () {
    const points = this._selectPolygon.points
    const lastPointIndex = points.length - 1
    const start = this._selectPolygon.start

    return {
      type: 'Polygon',
      coordinates: [
        [start, points[lastPointIndex - 1], points[lastPointIndex], start]
      ]
    }
  }
}

function rectangleToRBushBbox (rectangle) {
  return {
    minX: Math.min(rectangle.x1, rectangle.x2),
    maxX: Math.max(rectangle.x1, rectangle.x2),
    minY: Math.min(rectangle.y1, rectangle.y2),
    maxY: Math.max(rectangle.y1, rectangle.y2)
  }
}

function parseCoordinates (coordinates) {
  if (is2dArray(coordinates)) return coordinates
  if (isXYObject(coordinates)) return [coordinates.x, coordinates.y]

  throw new Error(`Invalid input: ${coordinates}`)
}

function is2dArray (coordinates) {
  return coordinates.constructor === Array &&
    coordinates.length === 2 &&
    coordinates.every(c => c && c.constructor === Number)
}

function isXYObject (coordinates) {
  return 'x' in coordinates && 'y' in coordinates &&
    coordinates.x.constructor === Number &&
    coordinates.y.constructor === Number
}

function bboxToRBushBbox (bbox) {
  return {
    minX: Math.min(...bbox.x),
    maxX: Math.max(...bbox.x),
    minY: Math.min(...bbox.y),
    maxY: Math.max(...bbox.y)
  }
}
