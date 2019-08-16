import InteractionHandler from './InteractionHandler.js'

export default class MouseoverHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._previousMouseoverIds = {}
    this._currentMouseoverIds = {}
    this._startTime = undefined
    this._endTime = undefined
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-hover'
      
      eventManager.addEventListener('eventmove', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-hover'
      console.log('@@@@')
      eventManager.removeEventListener('eventmove', listenerId)
    }
  }

  _handleEvent (coordinates, event) {
    const eventManager = this._interactionManager._eventManager

    // Mouse goes into callback directly
    // Touch measures first then if it is less than 250ms, then goes into callback
    if (eventManager._detectIt.deviceType.includes('mouse') && eventManager._detectIt.primaryInput === 'mouse') {
      this._handleIndexing(coordinates, event)
    } else if (
      (eventManager._detectIt.deviceType.includes('touch') && eventManager._detectIt.primaryInput === 'touch') ||
      window.navigator.pointerEnabled || window.navigator.msPointerEnabled
    ) {
      console.log(event.type)
      if (event.type.includes('start') || event.type.includes('down')) {
        this._startTime = event.timeStamp
      } else {
        this._endTime = event.timeStamp
        const timeDiff = this._endTime - this._startTime

        // Considered as click if event lasts less than 250 ms
        if (timeDiff <= 250) {
          this._handleIndexing(coordinates, event)
        }
      }
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

      if (!this._mouseAlreadyOver(hitId)) {
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
