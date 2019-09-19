import InteractionHandler from './InteractionHandler.js'

import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class ClickHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._previousMouseoverIds = {}
    this._currentMouseoverIds = {}
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const handler = this._handleEvent.bind(this)
      
      const interactionManager = this.interactionManager()
      const eventManager = this.eventManager()
      const listenerId = interactionManager._id + '-mouseover'

      eventManager
        .eventTracker('mousemove')
        .addListener(listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this.interactionManager()
      const eventManager = this.eventManager()
      const listenerId = interactionManager._id + '-mouseover'

      eventManager
        .eventTracker('mousemove')
        .removeListener(listenerId)
    }
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

      this._currentMouseoverIds[hitId] = true

      if (!(hitId in this._previousMouseoverHits)) {
        this._fireCallback(hit, screenCoordinates, nativeEvent)
      }
    }

    this._previousMouseoverIds = this._currentMouseoverIds
    this._currentMouseoverIds = {}
  }

  _fireCallback (hit, screenCoordinates, nativeEvent) {
    const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager())

    const clickEvent = createEvent('mouseover', {
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

function getHitId (hit) {
  if (hitIsMark(hit)) return hit.markId
  if (hitIsInLayer(hit)) return hit.layerId + '-' + hit.key
}
