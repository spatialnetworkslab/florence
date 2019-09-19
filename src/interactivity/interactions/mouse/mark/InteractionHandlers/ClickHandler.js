import MarkInteractionHandler from '../../../_base/MarkInteractionHandler.js'

import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class ClickHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'click',
      eventName: 'click',
      inputDevice: 'mouse'
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

      const clickEvent = createEvent('click', {
        screenCoordinates,
        localCoordinates
      }, nativeEvent)

      if (hitIsMark(hit)) {
        this._markCallbacks[hit.markId](clickEvent)
      }

      if (hitIsInLayer(hit)) {
        clickEvent.key = hit.key
        clickEvent.index = hit.index
        this._layerCallbacks[hit.layerId](clickEvent)
      }
    }
  }
}
