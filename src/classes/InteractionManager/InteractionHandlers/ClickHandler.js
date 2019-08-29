import InteractionHandler from './InteractionHandler.js'
import { createClickEvent } from './utils/createEvent.js'

export default class ClickHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._startTime = undefined
    this._endTime = undefined
  }

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

  _handleEvent (screenCoordinates, event) {
    const eventManager = this._interactionManager._eventManager
    // Mouse goes into callback directly
    // Touch measures first then if it is less than 250ms, then goes into callback
    if (eventManager._detectIt.deviceType.includes('mouse') && eventManager._detectIt.primaryInput === 'mouse') {
      this._callStoredCallback(screenCoordinates, event)
    } else if (
      (eventManager._detectIt.deviceType.includes('touch') && eventManager._detectIt.primaryInput === 'touch') ||
      window.navigator.pointerEnabled || window.navigator.msPointerEnabled
    ) {
      if (event.type.includes('start') || event.type.includes('down')) {
        this._startTime = event.timeStamp
      } else {
        this._endTime = event.timeStamp
        const timeDiff = this._endTime - this._startTime

        // Considered as click if event lasts less than 250 ms
        if (timeDiff <= 250) {
          this._callStoredCallback(screenCoordinates, event)
        }
      }
    }
  }

  _callStoredCallback (screenCoordinates, nativeEvent) {
    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)
    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]

      const localCoordinates = this._getLocalCoordinates(screenCoordinates)

      if (this._isInLayer(hit)) {
        this._layerCallbacks[hit.layerId](
          createClickEvent({
            key: hit.key,
            screenCoordinates,
            localCoordinates
          }, nativeEvent)
        )
      }

      if (this._isMark(hit)) {
        this._markCallbacks[hit.markId](
          createClickEvent({
            key: hit.key,
            screenCoordinates,
            localCoordinates
          }, nativeEvent)
        )
      }
    }
  }
}
