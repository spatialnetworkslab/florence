import InteractionHandler from './InteractionHandler.js'

export default class MouseoutHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._previousHits = {}
    this._currentMouseoverIds = {}
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-mouseout'

      // How do we chain listening for events here? 
      eventManager.addEventListener('mousemove', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-mouseout'

      eventManager.removeEventListener('mousemove', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    this._currentMouseoverIds = {}

    let spatialIndex = this._spatialIndex
    let hits = spatialIndex.queryMouseCoordinates(coordinates)
    this._storeHits(hits)
    this._fireForMouseOutHits(mouseEvent)
  }
  
  _storeHits (hits) {
    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i]
      let hitId = this._getHitId(hit)

      if (!this._mouseAlreadyOver(hitId)) {
        this._previousHits[hitId] = hit
      }

      this._currentMouseoverIds[hitId] = true
    }
  }

  // TO FIX
  _fireForMouseOutHits (mouseEvent) {
    let eventCoordinates = { 'x': mouseEvent.clientX, 'y': mouseEvent.clientY }

    for (let hitId in this._previousHits) {
      // activates if it's not currently being hovered over
      if (!this._currentMouseoverIds.hasOwnProperty(hitId)) {
        let hit = this._previousHits[hitId]

        if (this._isInLayer(hit)) {
          this._layerCallbacks[hit.layerId](hit.$index, mouseEvent)
        }

        if (this._isMark(hit)) {
          this._markCallbacks[hit.markId](mouseEvent)
        }
        delete this._previousHits[hitId]
      }
    }
  }

  _getHitId (hit) {
    let id
    if (this._isInLayer(hit)) id = hit.layerId + '-' + hit.$index
    if (this._isMark(hit)) id = hit.markId
    return id
  }

  _mouseAlreadyOver (hitId) {
    return this._previousHits.hasOwnProperty(hitId)
  }
}
