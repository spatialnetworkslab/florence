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

      eventManager.addEventListener('mousemove', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-mouseover'

      eventManager.removeEventListener('mousemove', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    this._currentMouseoverIds = {}

    this._handleSectionHits(mouseEvent)

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(coordinates)
    this._handleHits(hits, mouseEvent)

    this._cleanupPreviousHits()
  }

  _handleHits (hits, mouseEvent) {
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = this._getHitId(hit)

      if (!this._mouseAlreadyOver(hitId)) {
        this._previousMouseoverIds[hitId] = true

        if (this._isInLayer(hit)) {
          this._layerCallbacks[hit.layerId](hit.$index, mouseEvent)
        }

        if (this._isMark(hit)) {
          this._markCallbacks[hit.markId](mouseEvent)
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
