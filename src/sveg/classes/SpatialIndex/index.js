import RBush from 'rbush'
import { markIndexing, layerIndexing } from './indexingFunctions'
import collisionTests from './collisionTests'

export default class SpatialIndex {
  constructor (markType) {
    this._markType = markType
    this._rbush = new RBush()

    this._rootNode = undefined
    this._svgPoint = undefined

    this._listeningForClicks = false
    this._clickCallback = undefined
  }

  setRootNode (rootNode) {
    if (!this._rootNode) {
      this._rootNode = rootNode
      this._svgPoint = this._rootNode.createSVGPoint()
    }
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
    let searchArea = searchAreaFromCoordinates(coordinates, radius)
    let indexQueryResults = this._rbush.search(searchArea)
    return this._getHits(coordinates, indexQueryResults)
  }

  listenForClicks (callback) {
    this._listeningForClicks = true
    this._rootNode.addEventListener('click', this._clickHandler.bind(this))
    this._clickCallback = callback
  }

  _clickHandler (event) {
    let coordinates = this._getCoordinates(event)
    let hits = this.hitCoordinates(coordinates)

    if (hits) {
      for (let i = 0; i < hits.length; i++) {
        this._clickCallback(hits[i], event)
      }
    }
  }

  _getCoordinates (event) {
    this._svgPoint.x = event.clientX
    this._svgPoint.y = event.clientY

    return this._svgPoint.matrixTransform(this._rootNode.getScreenCTM().inverse())
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
