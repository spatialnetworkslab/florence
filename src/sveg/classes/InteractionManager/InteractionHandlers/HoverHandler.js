import InteractionHandler from './InteractionHandler.js'

export default class HoverHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._currentHovering = {}
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager

      eventManager.addEventListener('mousemove', interactionManager._id, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager

      eventManager.removeEventListener('mousemove', interactionManager._id)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    let spatialIndex = this._spatialIndex

    let hits = spatialIndex.queryMouseCoordinates(coordinates)

    let currentHits = this._handleNewHits(hits, mouseEvent)
    this._cleanUpPreviousHits(currentHits)
  }

  _handleNewHits (hits, mouseEvent) {
    let currentHits = {}

    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i]
      let id = this._getUniversalId(hit)

      if (!this._alreadyHovering(id)) {
        if (this._isInLayer(hit)) {
          this._layerCallbacks[hit.layerId](hit.$index, mouseEvent)
        }
  
        if (this._isMark(hit)) {
          for (let j = 0; j < hit.callbacks.length; j++) {
            if (hit.callbacks[j]) hit.callbacks[j](mouseEvent)
          }
        }

        this._startHovering(id, hit)
      }

      currentHits[id] = true
    }

    return currentHits
  }

  _cleanUpPreviousHits (currentHits) {
    for (let id in this._currentHovering) {
      if (!currentHits.hasOwnProperty(id)) {
        this._stopHovering(id)
      }
    }
  }

  _alreadyHovering (id) {
    return this._currentHovering.hasOwnProperty(id)
  }

  _startHovering (id, hit) {
    this._currentHovering[id] = hit
  }

  _stopHovering (id) {
    let previousHit = this._currentHovering[id]

    if (this._isInLayer(previousHit)) {
      this._layerCallbacks[previousHit.layerId](undefined)
    }

    if (this._isMark(previousHit)) {
      for (let j = 0; j < previousHit.callbacks.length; j++) {
        if (previousHit.callbacks[j]) previousHit.callbacks[j](undefined)
      }
    }
    delete this._currentHovering[id]
  }

  _getUniversalId (hit) {
    let id
    if (this._isInLayer(hit)) id = hit.layerId + '-' + hit.$index
    if (this._isMark(hit)) id = hit.markId

    return id
  }
}
