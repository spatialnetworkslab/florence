import InteractionHandler from './InteractionHandler.js'

export default class ClickHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-click'

      eventManager.addEventListener('click', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-click'

      eventManager.removeEventListener('click', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    let spatialIndex = this._spatialIndex

    let hits = spatialIndex.queryMouseCoordinates(coordinates)

    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i]

      if (this._isInLayer(hit)) {
        this._layerCallbacks[hit.layerId](hit.$index)
      }

      if (this._isMark(hit)) {
        this._markCallbacks[hit.markId]()
      }
    }
  }
}
