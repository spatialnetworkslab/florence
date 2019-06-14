import InteractionHandler from './InteractionHandler.js'

export default class ClickHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager

      eventManager.addEventListener('click', interactionManager._id, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager

      eventManager.removeEventListener('click', interactionManager._id)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    let interactionManager = this._interactionManager
    let spatialIndex = interactionManager._spatialIndex

    let hits = spatialIndex.queryMouseCoordinates(coordinates)

    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i]

      if (this._isInLayer(hit)) {
        this._layerCallbacks[hit.layerId](hit.$index)
      }

      if (this._isMark(hit)) {
        for (let j = 0; j < hit.callbacks.length; j++) {
          if (hit.callbacks[j]) hit.callbacks[j]()
        }
      }
    }
  }
}
