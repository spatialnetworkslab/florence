import InteractionHandler from './InteractionHandler.js'

export default class MouseoverHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._previousMouseoverIds = {}
    this._currentMouseoverIds = {}
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-mouseover'

      eventManager.addEventListener('mousemove', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-mouseover'

      eventManager.removeEventListener('mousemove', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
    this._currentMouseoverIds = {}

    this._handleSectionHits(mouseEvent)
    
    let spatialIndex = this._spatialIndex
    let hits = spatialIndex.queryMouseCoordinates(coordinates)
    this._handleHits(hits, mouseEvent)

    this._cleanupPreviousHits()
  }

  _handleSectionHits (mouseEvent) {
    let sections = this._interactionManager._sections
    let eventCoordinates = { 'x': mouseEvent.clientX, 'y': mouseEvent.clientY }

    for (let s in sections) {

      if (!this._mouseAlreadyOver(s)) {
        this._previousMouseoverIds[s] = true
        if (this._isInSection(eventCoordinates, sections[s]) && this._sectionCallbacks[s]) {
          this._sectionCallbacks[s](s, mouseEvent)
        }
      }
      //this._currentMouseoverIds[s] = true
    }
  }

  _handleHits (hits, mouseEvent) {
    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i]
      let hitId = this._getHitId(hit)

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
    for (let hitId in this._previousMouseoverIds) {
      if (!this._currentMouseoverIds.hasOwnProperty(hitId)) {
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
    return this._previousMouseoverIds.hasOwnProperty(hitId)
  }
}
