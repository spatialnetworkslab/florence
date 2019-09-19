import MarkInteractionHandler from '../../../_base/MarkInteractionHandler.js'

import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection, hitIsMark, hitIsInLayer } from '../../../utils/hitUtils.js'

export default class ClickHandler extends MarkInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mouseover',
      eventName: 'mousemove',
      inputDevice: 'mouse'
    })

    this._previousMouseoverIds = {}
    this._currentMouseoverIds = {}
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
