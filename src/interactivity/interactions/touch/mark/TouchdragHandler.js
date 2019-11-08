import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer, getHitId } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchdragHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchdrag',
      eventName: ['touchstart', 'touchmove', 'touchend']
    })

    this._currentHits = {}
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (numberOfTouches(screenCoordinates) !== 1) {
      return
    }

    if (nativeEvent.eventName === 'touchstart') {
      this._handleTouchstart(screenCoordinates, nativeEvent)
    }

    if (nativeEvent.eventName === 'touchmove') {
      this._handleTouchmove(screenCoordinates, nativeEvent)
    }

    if (nativeEvent.eventName === 'touchend') {
      this._handleTouchend(screenCoordinates, nativeEvent)
    }
  }

  _handleTouchstart (screenCoordinates, nativeEvent) {
    if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
      return
    }

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = getHitId(hit)

      this._currentHits[hitId] = hit

      this._fireCallback(hit, screenCoordinates, nativeEvent, 'start')
    }
  }

  _handleTouchmove (screenCoordinates, nativeEvent) {
    if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
      return
    }

    for (const hitId in this._currentHits) {
      const hit = this._currentHits[hitId]
      this._fireCallback(hit, screenCoordinates, nativeEvent, 'drag')
    }
  }

  _handleTouchend (screenCoordinates, nativeEvent) {
    for (const hitId in this._currentHits) {
      const hit = this._currentHits[hitId]
      this._fireCallback(hit, screenCoordinates, nativeEvent, 'end')
    }

    this._currentHits = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent, dragType) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    if (hitIsMark(hit)) {
      const touchdragEvent = createMarkEvent('touchdrag', {
        screenCoordinates,
        localCoordinates,
        dragType
      }, hit, nativeEvent)

      this._markCallbacks[hit.markId](touchdragEvent)
    }

    if (hitIsInLayer(hit)) {
      const touchdragEvent = createLayerEvent('touchdrag', {
        screenCoordinates,
        localCoordinates,
        dragType
      }, hit, nativeEvent)

      this._layerCallbacks[hit.layerId](touchdragEvent)
    }
  }
}
