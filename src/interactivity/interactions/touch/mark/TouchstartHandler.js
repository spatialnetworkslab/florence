import MarkInteractionHandler from '../../base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { hitIsMark, hitIsInLayer } from '../../utils/hitUtils.js'

export default class TouchstartHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchstart',
      eventName: 'touchstart'
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]

      if (hitIsMark(hit)) {
        const touchstartEvent = createMarkEvent('touchstart', {
          screenCoordinates,
          localCoordinates
        }, hit, nativeEvent)

        this._markCallbacks[hit.markId](touchstartEvent)
      }

      if (hitIsInLayer(hit)) {
        const touchstartEvent = createLayerEvent('touchstart', {
          screenCoordinates,
          localCoordinates
        }, hit, nativeEvent)

        this._layerCallbacks[hit.layerId](touchstartEvent)
      }
    }
  }
}
