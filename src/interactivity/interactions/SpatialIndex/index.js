import RBush from 'rbush'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor (interactionHandler) {
    this._rbush = new RBush()
    this._interactionHandler = interactionHandler
  }

  // Layer indexing and unindexing
  indexLayer (layerId) {
    const indexableData = this._interactionHandler._layers[layerId]
    this._rbush.load(indexableData)
  }

  unindexLayer (layerId) {
    const layer = this._interactionHandler._layers[layerId]

    for (let i = 0; i < layer.length; i++) {
      const item = layer[i]
      this._rbush.remove(item)
    }
  }

  // Mark loading and removing
  indexMark (markId) {
    const indexableItem = this._interactionHandler._marks[markId]

    if (multipleSegments(indexableItem)) {
      this._rbush.load(indexableItem)
    } else {
      this._rbush.insert(indexableItem)
    }
  }

  unindexMark (markId) {
    const indexableItem = this._interactionHandler._marks[markId]

    if (multipleSegments(indexableItem)) {
      for (let i = 0; i < indexableItem.length; i++) {
        const item = indexableItem[i]
        this._rbush.remove(item)
      }
    } else {
      this._rbush.remove(indexableItem)
    }
  }

  // Query functions
  queryMouseCoordinates (mouseCoordinates, radius) {
    const searchArea = searchAreaFromCoordinates(mouseCoordinates, radius)
    const indexQueryResults = this._rbush.search(searchArea)

    return this._getHits(mouseCoordinates, indexQueryResults)
  }

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
