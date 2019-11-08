import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { hitIsMark, hitIsInLayer } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchupHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchup',
      eventName: ['touchend', 'touchcancel']
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (numberOfTouches(screenCoordinates) !== 1) {
      return
    }

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]

      if (hitIsMark(hit)) {
        const touchupEvent = createMarkEvent('touchup', {
          screenCoordinates,
          localCoordinates
        }, hit, nativeEvent)

        this._markCallbacks[hit.markId](touchupEvent)
      }

      if (hitIsInLayer(hit)) {
        const touchupEvent = createLayerEvent('touchup', {
          screenCoordinates,
          localCoordinates
        }, hit, nativeEvent)

        this._layerCallbacks[hit.layerId](touchupEvent)
      }
    }
  }
}
