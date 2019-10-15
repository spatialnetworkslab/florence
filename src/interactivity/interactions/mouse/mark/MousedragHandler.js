import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer, getHitId } from '../../utils/hitUtils.js'

export default class MousedragHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mousedrag',
      eventName: ['mousedown', 'mousemove', 'mouseup']
    })

    this._currentHits = {}
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (nativeEvent.type === 'mousedown') {
      this._handleMousedown(screenCoordinates, nativeEvent)
    }

    if (nativeEvent.type === 'mousemove') {
      this._handleMousemove(screenCoordinates, nativeEvent)
    }

    if (nativeEvent.type === 'mouseup') {
      this._handleMouseup(screenCoordinates, nativeEvent)
    }
  }

  _handleMousedown (screenCoordinates, nativeEvent) {
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

  _handleMousemove (screenCoordinates, nativeEvent) {
    if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
      return
    }

    for (const hitId in this._currentHits) {
      const hit = this._currentHits[hitId]
      this._fireCallback(hit, screenCoordinates, nativeEvent, 'drag')
    }
  }

  _handleMouseup (screenCoordinates, nativeEvent) {
    for (const hitId in this._currentHits) {
      const hit = this._currentHits[hitId]
      this._fireCallback(hit, screenCoordinates, nativeEvent, 'end')
    }

    this._currentHits = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent, dragType) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    if (hitIsMark(hit)) {
      const mouseoutEvent = createMarkEvent('drag', {
        screenCoordinates,
        localCoordinates,
        dragType
      }, hit, nativeEvent)

      this._markCallbacks[hit.markId](mouseoutEvent)
    }

    if (hitIsInLayer(hit)) {
      const mouseoutEvent = createLayerEvent('drag', {
        screenCoordinates,
        localCoordinates,
        dragType
      }, hit, nativeEvent)

      this._layerCallbacks[hit.layerId](mouseoutEvent)
    }
  }
}
