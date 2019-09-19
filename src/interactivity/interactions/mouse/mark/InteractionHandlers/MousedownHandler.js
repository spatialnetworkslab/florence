import InteractionHandler from './InteractionHandler.js'

import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class MousedownHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)

      const interactionManager = this.interactionManager()
      const eventManager = this.eventManager()
      const listenerId = interactionManager._id + '-mousedown'

      eventManager
        .eventTracker('mousedown')
        .addListener(listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this.interactionManager()
      const eventManager = this.eventManager()
      const listenerId = interactionManager._id + '-mousedown'

      eventManager
        .eventTracker('mousedown')
        .removeListener(listenerId)
    }
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

      const clickEvent = createEvent('mousedown', {
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
