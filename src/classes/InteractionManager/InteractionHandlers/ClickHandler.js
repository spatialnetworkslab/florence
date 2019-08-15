import InteractionHandler from './InteractionHandler.js'

export default class ClickHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-click'

      eventManager.addEventListener('eventclick', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-click'

      eventManager.removeEventListener('eventclick', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(coordinates)
    
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]

      if (this._isInLayer(hit)) {
        this._layerCallbacks[hit.layerId](hit.$index, mouseEvent)
      }

      if (this._isMark(hit)) {
        this._markCallbacks[hit.markId](mouseEvent)
      }
    }
  }
}
