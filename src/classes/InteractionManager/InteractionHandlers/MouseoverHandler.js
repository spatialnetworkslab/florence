import InteractionHandler from './InteractionHandler.js'

export default class MouseoverHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._previousMouseoverIds = {}
    this._currentMouseoverIds = {}
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-mouseover'

      eventManager.addEventListener('eventmove', listenerId + '-move', handler)
      if (eventManager._detectIt.deviceType.includes('touch')) {
        eventManager.addEventListener('eventcancel', listenerId + '-end', handler)
      }
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-mouseover'

      eventManager.removeEventListener('eventmove', listenerId)
    }
  }

  _nopropagation (event) {
    event.preventDefault() // Cancel the event from affecting the whole window
  }

  _handleEvent (coordinates, event) {
    // this._nopropagation(event)
    const eventManager = this._interactionManager._eventManager

    // Mouse goes into callback directly
    if (eventManager._detectIt.deviceType.includes('mouse') && eventManager._detectIt.primaryInput === 'mouse') {
      this._handleIndexing(coordinates, event)

    // Touch measures first then if it is less than 250ms, then goes into callback
    } else if (
      (eventManager._detectIt.deviceType.includes('touch') && eventManager._detectIt.primaryInput === 'touch') ||
      window.navigator.pointerEnabled || window.navigator.msPointerEnabled
    ) {
      const self = this
      this._pressTimer = window.setTimeout(function () {
        self._handleIndexing(coordinates, event)
      }, 250)
    }
  }

  _handleIndexing (coordinates, event) {
    this._currentMouseoverIds = {}

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(coordinates)

    this._handleHits(hits, event)

    this._cleanupPreviousHits()
  }

  _handleHits (hits, event) {
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = this._getHitId(hit)
      console.log('over', event.type)
      console.log(!this._mouseAlreadyOver(hitId),(this._mouseAlreadyOver(hitId) && event.type.includes('move')))
      if (!this._mouseAlreadyOver(hitId) || (this._mouseAlreadyOver(hitId) && event.type.includes('move'))) {
        this._previousMouseoverIds[hitId] = true

        if (this._isInLayer(hit)) {
          this._layerCallbacks[hit.layerId](hit.$index, event)
        }

        if (this._isMark(hit)) {
          this._markCallbacks[hit.markId](event)
        }
      }

      this._currentMouseoverIds[hitId] = true
    }
  }

  _cleanupPreviousHits () {
    for (const hitId in this._previousMouseoverIds) {
      if (!(hitId in this._currentMouseoverIds)) {
        delete this._previousMouseoverIds[hitId]
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
    return hitId in this._previousMouseoverIds
  }
}
