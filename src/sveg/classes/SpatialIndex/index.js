import RBush from 'rbush'
import { markIndexing, layerIndexing } from './indexingFunctions'

export default class SpatialIndex {
  constructor (markType) {
    this._markType = markType
    this._rbush = new RBush()
  }

  addMark (coordinates, index) {
    let indexingFunction = markIndexing[this._markType]

    this._rbush.insert(indexingFunction(coordinates, index))
  }

  addLayer (layer, indexArray) {
    let indexingFunction = layerIndexing[this._markType]

    this._rbush.load(indexingFunction(layer, indexArray))
  }

  hitCoordinates (coordinates, radius) {
    let searchArea = searchAreaFromCoordinates(coordinates)

    this._rbush.search(searchArea)
  }
}

function searchAreaFromCoordinates (coordinates, radius = 0) {
  return {
    minX: coordinates.x - radius,
    maxX: coordinates.x + radius,
    minY: coordinates.y - radius,
    maxY: coordinates.y + radius
  }
}
