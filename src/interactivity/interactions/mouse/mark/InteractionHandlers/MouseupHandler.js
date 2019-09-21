import MarkInteractionHandler from '../../../_base/handlers/MarkInteractionHandler.js'

import { createMarkEvent, createLayerEvent } from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class MouseupHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mouseup',
      eventName: 'mouseup'
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
      return
    }

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]

      if (hitIsMark(hit)) {
        const mouseupEvent = createMarkEvent('mouseup', {
          screenCoordinates,
          localCoordinates
        }, hit, nativeEvent)

        this._markCallbacks[hit.markId](mouseupEvent)
      }

      if (hitIsInLayer(hit)) {
        const mouseupEvent = createLayerEvent('mouseup', {
          screenCoordinates,
          localCoordinates
        }, hit, nativeEvent)

        this._layerCallbacks[hit.layerId](mouseupEvent)
      }
    }
  }
}
