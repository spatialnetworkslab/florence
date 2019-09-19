import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../../utils/hitUtils.js'
import getScrollLineHeight from '../../../utils/getScrollLineHeight.js'

export default class WheelHandler {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._callback = undefined
  }

  addInteraction (callback) {
    if (!this._callback) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-wheel'

      const handler = this._handleEvent.bind(this)

      eventManager
        .eventTracker('wheel')
        .addListener(listenerId, handler)

      this._callback = callback
    }
  }

  removeInteraction () {
    if (this._callback) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-wheel'

      eventManager
        .eventTracker('wheel')
        .removeListener(listenerId)

      delete this._callback
    }
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    nativeEvent.preventDefault()
    nativeEvent.stopPropagation()

    const interactionManager = this._interactionManager
    const section = interactionManager._section

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)
      const wheelDelta = getWheelDelta(nativeEvent)

      const wheelEvent = createEvent('wheel', {
        screenCoordinates,
        localCoordinates,
        wheelDelta
      }, nativeEvent)

      this._callback(wheelEvent)
    }
  }
}

let scrollLineHeight

function getWheelDelta (nativeEvent) {
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
