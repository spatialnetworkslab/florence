import RBush from 'rbush'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor (interactionHandler) {
    this._rbush = new RBush()
    this._interactionHandler = interactionHandler
  }

  // Layer indexing and unindexing
  indexLayer (layerId) {
    let indexableData = this._interactionHandler._layers[layerId]
    this._rbush.load(indexableData)
  }

  unindexLayer (layerId) {
    let layer = this._interactionHandler._layers[layerId]

    for (let i = 0; i < layer.length; i++) {
      let item = layer[i]
      this._rbush.remove(item)
    }
  }

  // Mark loading and removing
  indexMark (markId) {
    let indexableItem = this._interactionHandler._marks[markId]
    this._rbush.insert(indexableItem)
  }

  unindexMark (markId) {
    let indexableItem = this._interactionHandler._marks[markId]
    this._rbush.remove(indexableItem)
  }

  // Query functions
  queryMouseCoordinates (mouseCoordinates, radius) {
    let searchArea = searchAreaFromCoordinates(mouseCoordinates, radius)
    let indexQueryResults = this._rbush.search(searchArea)
    return this._getHits(mouseCoordinates, indexQueryResults)
  }

  _getHits (coordinates, indexQueryResults) {
    let hits = []

    for (let i = 0; i < indexQueryResults.length; i++) {
      let indexQueryResult = indexQueryResults[i]
      let collisionTest = collisionTests[indexQueryResult.markType]

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
