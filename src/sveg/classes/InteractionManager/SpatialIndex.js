import RBush from 'rbush'
import { layerIndexing } from './indexingFunctions'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor () {
    this._rbush = new RBush()
    this._layers = {}
  }

  loadLayer (layerType, layerData) {
    let indexingFunction = layerIndexing[layerType]
    let indexableData = indexingFunction(layerData)

    let layerId = layerData.layerId
    this._layers[layerId] = indexableData

    this._rbush.load(this._layers[layerId])
  }

  layerIsLoaded (layerId) {
    return this._layers[layerId] !== undefined
  }

  removeLayer (layerId) {
    let layer = this._layers[layerId]

    for (let i = 0; i < layer.length; i++) {
      let item = layer[i]
      this._rbush.remove(item)
    }

    delete this._layers[layerId]
  }

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
