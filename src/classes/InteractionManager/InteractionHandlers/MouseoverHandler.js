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

      // Mouse
      if (eventManager._detectIt.deviceType.includes('mouse')) {
        eventManager.addEventListener('eventmove', listenerId + '-mouse', handler)
      }

      // Touch
      if (eventManager._detectIt.deviceType.includes('touch')) {
        eventManager.addEventListener('eventdown', listenerId + '-touch', handler)
      }
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-mouseover'

      // Mouse
      if (eventManager._detectIt.deviceType.includes('mouse')) {
        eventManager.removeEventListener('eventmove', listenerId + '-mouse')
      }

      // Touch
      if (eventManager._detectIt.deviceType.includes('touch')) {
        eventManager.removeEventListener('eventdown', listenerId + '-touch')
      }
    }
  }

  _handleEvent (coordinates, event) {
    const eventManager = this._interactionManager._eventManager

    // Mouse goes into callback directly
    if (eventManager._detectIt.deviceType.includes('mouse') && eventManager._detectIt.primaryInput === 'mouse') {
      this._handleIndexing(coordinates, event)

    // Touch measures first then if it is greater than 250ms, then goes into callback
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
      
      // 1. First condition is for mouse/desktop, where cursor always present
      // 2. Second condition is for touch cases, where cursor leaves screen
      if (!this._mouseAlreadyOver(hitId) || (this._mouseAlreadyOver(hitId) && event.type.includes('touch'))) {
        this._previousMouseoverIds[hitId] = true
        if (this._isInLayer(hit)) {
          this._layerCallbacks[hit.layerId](hit.key, event)
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
    if (this._isInLayer(hit)) id = hit.layerId + '-' + hit.key
    if (this._isMark(hit)) id = hit.markId

    return id
  }

  _mouseAlreadyOver (hitId) {
    return hitId in this._previousMouseoverIds
  }
}
