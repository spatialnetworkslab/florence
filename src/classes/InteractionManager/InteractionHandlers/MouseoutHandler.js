import InteractionHandler from './InteractionHandler.js'

export default class MouseoutHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._previousHits = {}
    this._currentMouseoverIds = {}
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-mouseout'
      this._interruptedTouch = eventManager._exceptions['mouseout']

      eventManager.addEventListener('eventmove', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-mouseout'

      eventManager.removeEventListener('eventmove', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    this._currentMouseoverIds = {}

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(coordinates)

    this._storeHits(hits)
    this._fireForMouseOutHits(mouseEvent)
  }

  _storeHits (hits) {
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = this._getHitId(hit)

      if (!this._mouseAlreadyOver(hitId)) {
        this._previousHits[hitId] = hit
      }

      this._currentMouseoverIds[hitId] = true
    }
  }

  _fireForMouseOutHits (mouseEvent) {
    // add something for specific event types like touchcancel, touchup where it fires
    // despite being inside mark
    //ended here
    //console.log(this._previousHits, mouseEvent.type)
    for (const hitId in this._previousHits) {
      if (!(hitId in this._currentMouseoverIds) || this._interruptedTouch.includes(mouseEvent.type)) {
        const hit = this._previousHits[hitId]

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
    return hitId in this._previousHits
  }
}
