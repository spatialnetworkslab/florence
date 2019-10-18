import RBush from 'rbush'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor (interactionHandler, getMark, getLayer) {
    this._rbush = new RBush()
    this._interactionHandler = interactionHandler

    this._getMark = getMark.bind(interactionHandler)
    this._getLayer = getLayer.bind(interactionHandler)
  }

  // Layer indexing and unindexing
  indexLayer (layerId) {
    const layer = this._getLayer(layerId)
    this._rbush.load(layer)
  }

  unindexLayer (layerId) {
    const layer = this._getLayer(layerId)

    for (let i = 0; i < layer.length; i++) {
      const item = layer[i]
      this._rbush.remove(item)
    }
  }

  // Mark loading and removing
  indexMark (markId) {
    const mark = this._getMark(markId)

    if (multipleSegments(mark)) {
      this._rbush.load(mark)
    } else {
      this._rbush.insert(mark)
    }
  }

  unindexMark (markId) {
    const mark = this._getMark(markId)

    if (multipleSegments(mark)) {
      for (let i = 0; i < mark.length; i++) {
        const item = mark[i]
        this._rbush.remove(item)
      }
    } else {
      this._rbush.remove(mark)
    }
  }

  // Query functions
  queryMouseCoordinates (mouseCoordinates, radius) {
    const searchArea = searchAreaFromCoordinates(mouseCoordinates, radius)
    const indexQueryResults = this._rbush.search(searchArea)

    return this._getHits(mouseCoordinates, indexQueryResults)
  }

  queryBoundingBox (boundingBox) {
    return this._rbush.search(boundingBox)
  }

  // Internal
  _getHits (coordinates, indexQueryResults) {
    const hits = []

    for (let i = 0; i < indexQueryResults.length; i++) {
      const indexQueryResult = indexQueryResults[i]
      const collisionTest = collisionTests[indexQueryResult.markType]

      if (collisionTest(coordinates, indexQueryResult.attributes)) {
        hits.push(indexQueryResult)
      }
    }

    return hits
  }
}

function searchAreaFromCoordinates (coordinates, radius = 3) {
  return {
    minX: coordinates.x - radius,
    maxX: coordinates.x + radius,
    minY: coordinates.y - radius,
    maxY: coordinates.y + radius
  }
}

function multipleSegments (indexableItem) {
  return indexableItem.constructor === Array
}
