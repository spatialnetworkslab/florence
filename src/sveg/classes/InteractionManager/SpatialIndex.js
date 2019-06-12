import RBush from 'rbush'
// import { layerIndexing } from './indexingFunctions'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor (markType) {
    this._markType = markType
    this._rbush = new RBush()
  }

  queryMouseCoordinates (mouseCoordinates, radius) {
    let searchArea = searchAreaFromCoordinates(mouseCoordinates, radius)
    let indexQueryResults = this._rbush.search(searchArea)
    return this._getHits(mouseCoordinates, indexQueryResults)
  }

  _getHits (coordinates, indexQueryResults) {
    let hits = []
    let collisionTest = collisionTests[this._markType]

    for (let i = 0; i < indexQueryResults.length; i++) {
      let indexQueryResult = indexQueryResults[i]

      if (collisionTest(coordinates, indexQueryResult.geometry)) {
        hits.push(indexQueryResult.$index)
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
