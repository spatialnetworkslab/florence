export default class ClickManager {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._numberOfInteractions = 0
    this._layerCallbacks = {}
  }

  addInteraction (layerId, callback) {
    if (this._numberOfInteractions === 0) {
      let handler = this._handleClick.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager

      eventManager.addEventListener('click', interactionManager._id, handler)
    }

    this._numberOfInteractions++
    this._layerCallbacks[layerId] = callback
  }

  removeInteraction (layerId) {
    this._numberOfInteractions--
    delete this._layerCallbacks[layerId]

    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager

      eventManager.removeEventListener('click', interactionManager._id)
    }
  }

  _handleClick (coordinates, mouseEvent) {
    let interactionManager = this._interactionManager
    let spatialIndex = interactionManager._spatialIndex

    let hits = spatialIndex.queryMouseCoordinates(coordinates)

    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i]

      if (isInLayer(hit)) {
        this._layerCallbacks[hit.layerId](hit.$index)
      }

      if (isMark(hit)) {
        hit.callback(hit.$index)
      }
    }
  }
}

const isInLayer = hit => hit.hasOwnProperty('layerId')
const isMark = hit => hit.hasOwnProperty('callback')
