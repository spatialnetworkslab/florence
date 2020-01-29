import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer, getHitId } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchoverHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchover',
      eventName: ['touchstart', 'touchmove']
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

      this._previousHits[hitId] = true
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

      this._currentHits[hitId] = true

      if (!(hitId in this._previousHits)) {
        this._fireCallback(hit, screenCoordinates, nativeEvent)
      }
    }

    this._previousHits = this._currentHits
    this._currentHits = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    if (hitIsMark(hit)) {
      const touchoverEvent = createMarkEvent('touchover', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._markCallbacks[hit.markId](touchoverEvent)
    }

    if (hitIsInLayer(hit)) {
      const touchoverEvent = createLayerEvent('touchover', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._layerCallbacks[hit.layerId](touchoverEvent)
    }
  }
}
