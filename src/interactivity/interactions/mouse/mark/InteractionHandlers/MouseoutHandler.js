import MarkInteractionHandler from '../../../_base/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class MouseoutHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mouseout',
      eventName: 'mousemove'
    })

    this._previousMouseoverHits = {}
    this._currentMouseoverHits = {}
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
      return
    }

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = getHitId(hit)

      this._currentMouseoverHits[hitId] = hit
    }

    for (const hitId in this._previousMouseoverHits) {
      if (!(hitId in this._currentMouseoverHits)) {
        const hit = this._currentMouseoverHits[hitId]
        this._fireCallback(hit, screenCoordinates, nativeEvent)
      }
    }

    this._previousMouseoverIds = this._currentMouseoverIds
    this._currentMouseoverIds = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    if (hitIsMark(hit)) {
      const mouseoutEvent = createMarkEvent('mouseout', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._markCallbacks[hit.markId](mouseoutEvent)
    }

    if (hitIsInLayer(hit)) {
      const mouseoutEvent = createLayerEvent('mouseout', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._layerCallbacks[hit.layerId](mouseoutEvent)
    }
  }
}

function getHitId (hit) {
  if (hitIsMark(hit)) return hit.markId
  if (hitIsInLayer(hit)) return hit.layerId + '-' + hit.key
}
