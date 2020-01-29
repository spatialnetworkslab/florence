import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'
import getScrollLineHeight from '../../utils/getScrollLineHeight.js'

export default class WheelHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'wheel',
      eventName: 'wheel'
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    nativeEvent.preventDefault()
    nativeEvent.stopPropagation()

    const interactionManager = this.interactionManager()
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)
      const delta = getDelta(nativeEvent)

      const wheelEvent = createSectionEvent('wheel', {
        screenCoordinates,
        localCoordinates,
        delta
      }, nativeEvent)

      this._callback(wheelEvent)
    }
  }
}

let scrollLineHeight

function getDelta (nativeEvent) {
  let delta

  // Legacy
  // IE pixels
  if ('wheelDelta' in nativeEvent && nativeEvent.wheelDelta !== 0) {
    delta = -nativeEvent.wheelDelta
  }

  // Mozilla
  if ('detail' in nativeEvent && nativeEvent.detail !== 0) {
    delta = -nativeEvent.detail
  }

  // Most other cases
  if ('deltaY' in nativeEvent && nativeEvent.deltaY !== 0) {
    delta = -nativeEvent.deltaY
  }

  if (!scrollLineHeight) {
    scrollLineHeight = getScrollLineHeight()
  }

  return delta * (nativeEvent.deltaMode ? scrollLineHeight : 1) / 500
}
