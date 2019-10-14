import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { hitIsMark, hitIsInLayer, getHitId } from '../../utils/hitUtils.js'

export default class MouseoverHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mouseover',
      eventName: 'mousemove'
    })

    this._previousMouseoverIds = {}
    this._currentMouseoverIds = {}
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]
      const hitId = getHitId(hit)

      this._currentMouseoverIds[hitId] = true

      if (!(hitId in this._previousMouseoverIds)) {
        this._fireCallback(hit, screenCoordinates, nativeEvent)
      }
    }

    this._previousMouseoverIds = this._currentMouseoverIds
    this._currentMouseoverIds = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    if (hitIsMark(hit)) {
      const mouseoverEvent = createMarkEvent('mouseover', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._markCallbacks[hit.markId](mouseoverEvent)
    }

    if (hitIsInLayer(hit)) {
      const mouseoverEvent = createLayerEvent('mouseover', {
        screenCoordinates,
        localCoordinates
      }, hit, nativeEvent)

      this._layerCallbacks[hit.layerId](mouseoverEvent)
    }
  }
}
