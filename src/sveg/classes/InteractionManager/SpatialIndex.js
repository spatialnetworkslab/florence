import RBush from 'rbush'
import { markIndexing, layerIndexing } from './indexingFunctions'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor () {
    this._rbush = new RBush()
    this._layers = {}
    this._marks = {}
  }

  // Layer loading and removing
  loadLayer (layerType, layerData) {
    let indexingFunction = layerIndexing[layerType]
    let indexableData = indexingFunction(layerData)

    let layerId = layerData.layerId
    this._layers[layerId] = indexableData

    this._rbush.load(this._layers[layerId])
  }

  layerIsLoaded (layerId) {
    return this._layers.hasOwnProperty(layerId)
  }

  removeLayer (layerId) {
    let layer = this._layers[layerId]

    for (let i = 0; i < layer.length; i++) {
      let item = layer[i]
      this._rbush.remove(item)
    }

    delete this._layers[layerId]
  }

  // Mark loading and removing
  loadMark (markType, markData) {
    let indexingFunction = markIndexing[markType]
    let indexableItem = indexingFunction(markData)

    let markId = markData.markId
    this._marks[markId] = indexableItem

    this._rbush.insert(this._marks[markId])
  }

  markIsLoaded (markId) {
    return this._marks.hasOwnProperty(markId)
  }

  removeMark (markId) {
    let mark = this._marks[markId]
    this._rbush.remove(mark)
    delete this._marks[markId]
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
