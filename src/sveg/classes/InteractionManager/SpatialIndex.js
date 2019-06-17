import RBush from 'rbush'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor (interactionHandler) {
    this._rbush = new RBush()
    this._interactionHandler = interactionHandler
  }

  // Layer loading and removing
  loadLayer (layerId) {
    let indexableData = this._interactionHandler._layers[layerId]
    this._rbush.load(indexableData)
  }

  removeLayer (layerId) {
    let layer = this._interactionHandler._layers[layerId]

    for (let i = 0; i < layer.length; i++) {
      let item = layer[i]
      this._rbush.remove(item)
    }

    delete this._layers[layerId]
  }

  // Mark loading and removing
  loadMark (markId) {
    let indexableItem = this._interactionHandler._marks[markId]
    this._rbush.insert(indexableItem)
  }

  removeMark (markId) {
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

      if (collisionTest(coordinates, indexQueryResult.geometry)) {
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
