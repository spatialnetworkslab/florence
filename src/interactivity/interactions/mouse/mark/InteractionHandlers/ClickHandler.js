import InteractionHandler from './InteractionHandler.js'

import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class ClickHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-click'
      eventManager.addEventListener('eventclick', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-click'
      eventManager.removeEventListener('eventclick', listenerId)
    }
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    for (let i = 0; i < hits.length; i++) {
      const hit = hits[i]

      const localCoordinates = getLocalCoordinates(screenCoordinates, this._interactionManager)

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
