import SectionInteractionHandler from './SectionInteractionHandler.js'
import getScrollLineHeight from './utils/getScrollLineHeight.js'
import createEvent from './utils/createEvent.js'

let scrollLineHeight

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListener () {
    const eventManager = this._interactionManager._eventManager
    const listenerId = this._interactionManager._id + '-wheel'

    const handler = this._handleEvent.bind(this)
    eventManager.addEventListener('wheel', listenerId, handler)
  }

  _removeEventListener () {
    if (this._callback) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-wheel'

      eventManager.removeEventListener('wheel', listenerId)
    }
  }

  // normalised for most browsers, trackpads and mouses
  // based on openstreemtmaps: https://github.com/openstreetmap/iD/blob/f61c482188b1b747fdf528ac2992f6ed9e8a2b6a/modules/renderer/map.js#L376-L396
  // and normalize-wheel: https://github.com/basilfx/normalize-wheel/blob/master/src/normalizeWheel.js
  // Enables normal scrolling motion + legacy delta tracking
  _defaultWheelDelta (event) {
    let delta

    // Legacy
    // IE pixels
    if ('wheelDelta' in event && event.wheelDelta !== 0) {
      delta = -event.wheelDelta
    }

    // Mozilla
    if ('detail' in event && event.detail !== 0) {
      delta = -event.detail
    }

    // Most other cases
    if ('deltaY' in event && event.deltaY !== 0) {
      delta = -event.deltaY
    }

    if (!scrollLineHeight) {
      scrollLineHeight = getScrollLineHeight()
    }

    return delta * (event.deltaMode ? scrollLineHeight : 1) / 500
  }

  _nopropagation (nativeEvent) {
    nativeEvent.preventDefault() // Cancel the event
    nativeEvent.stopPropagation() // Don't bubble
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    this._nopropagation(nativeEvent)

    if (this._isInSection(screenCoordinates)) {
      const localCoordinates = this._getLocalCoordinates(screenCoordinates)
      const wheelDelta = this._defaultWheelDelta(nativeEvent)

      const wheelEvent = createEvent('wheel', {
        screenCoordinates,
        localCoordinates,
        wheelDelta
      }, nativeEvent)

      this._callback(wheelEvent)
    }
  }
}
