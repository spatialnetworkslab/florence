import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer, getHitId } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchoutHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchout',
      eventName: ['touchstart', 'touchmove', 'touchend']
    })

    this._previousHits = {}
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
      this._handleTouchend()
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

      this._previousHits[hitId] = hit
    }
  }

  _handleTouchmove (screenCoordinates, nativeEvent) {
    if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
      return
    }

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = getHitId(hit)

      this._currentHits[hitId] = hit
    }

    for (const hitId in this._previousHits) {
      if (!(hitId in this._currentHits)) {
        const hit = this._previousHits[hitId]
        this._fireCallback(hit, screenCoordinates, nativeEvent)
      }
    }

    this._previousHits = this._currentHits
    this._currentHits = {}
  }

  _handleTouchend () {
    this._previousHits = {}
    this._currentHits = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    if (hitIsMark(hit)) {
      const touchoutEvent = createMarkEvent('touchout', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._markCallbacks[hit.markId](touchoutEvent)
    }

    if (hitIsInLayer(hit)) {
      const touchoutEvent = createLayerEvent('touchout', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._layerCallbacks[hit.layerId](touchoutEvent)
    }
  }
}
