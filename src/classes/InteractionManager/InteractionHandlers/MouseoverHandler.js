import InteractionHandler from './InteractionHandler.js'
import createEvent from './utils/createEvent.js'

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
        eventManager.addEventListener('eventmove', listenerId + '-mouseover-mouse', handler)
      }

      // Touch
      if (eventManager._detectIt.deviceType.includes('touch')) {
        eventManager.addEventListener('eventdown', listenerId + '-mouseover-touch', handler)
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
        eventManager.removeEventListener('eventmove', listenerId)
      }

      // Touch
      if (eventManager._detectIt.deviceType.includes('touch')) {
        eventManager.removeEventListener('eventdown', listenerId)
      }
    }
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const eventManager = this._interactionManager._eventManager

    // Mouse goes into callback directly
    if (eventManager._detectIt.deviceType.includes('mouse') && eventManager._detectIt.primaryInput === 'mouse') {
      this._handleIndexing(screenCoordinates, nativeEvent)

    // Touch measures first then if it is greater than 250ms, then goes into callback
    } else if (
      (eventManager._detectIt.deviceType.includes('touch') && eventManager._detectIt.primaryInput === 'touch') ||
      window.navigator.pointerEnabled || window.navigator.msPointerEnabled
    ) {
      const self = this
      this._pressTimer = window.setTimeout(function () {
        self._handleIndexing(screenCoordinates, nativeEvent)
      }, 250)
    }
  }

  _handleIndexing (screenCoordinates, nativeEvent) {
    this._currentMouseoverIds = {}

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    this._handleHits(hits, screenCoordinates, nativeEvent)

    this._cleanupPreviousHits()
  }

  _handleHits (hits, screenCoordinates, nativeEvent) {
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = this._getHitId(hit)

      // 1. First condition is for mouse/desktop, where cursor always present
      // 2. Second condition is for touch cases, where cursor leaves screen
      if (!this._mouseAlreadyOver(hitId) || (this._mouseAlreadyOver(hitId) && nativeEvent.type.includes('touch'))) {
        this._previousMouseoverIds[hitId] = true

        const localCoordinates = this._getLocalCoordinates(screenCoordinates)
        const mouseoverEvent = createEvent('mouseover', {
          screenCoordinates,
          localCoordinates
        }, nativeEvent)

        if (this._isInLayer(hit)) {
          mouseoverEvent.key = hit.key
          this._layerCallbacks[hit.layerId](mouseoverEvent)
        }

        if (this._isMark(hit)) {
          this._markCallbacks[hit.markId](mouseoverEvent)
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
