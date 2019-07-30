import SectionInteractionHandler from './SectionInteractionHandler.js'
import getScrollLineHeight from './utils/getScrollLineHeight.js'

const scrollLineHeight = getScrollLineHeight()

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListener () {
    const handler = this._handleEvent.bind(this)
    const eventManager = this._interactionManager._eventManager
    const listenerId = this._interactionManager._id + '-wheel'
    eventManager.addEventListener('wheel', listenerId, handler)
  }

  _removeEventListener () {
    if (this._callback) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-wheel'

      eventManager.removeEventListener('wheel', listenerId)
    }
  }

  // normalised for all browsers, trackpads and mouses
  // based on openstreemtmaps: https://github.com/openstreetmap/iD/blob/f61c482188b1b747fdf528ac2992f6ed9e8a2b6a/modules/renderer/map.js#L376-L396
  // and normalize-wheel: https://github.com/basilfx/normalize-wheel/blob/master/src/normalizeWheel.js
  // Key data: This code tries to resolve a single slow step on a wheel to 1.
  // Why 10 and 40? Because they are considered reasonable line height defaults
  _defaultWheelDelta (event) {
    let k
    let delta

    // Legacy
    if ('detail' in event) { delta = event.detail }

    if ('deltaY' in event && event.deltaY !== 0) {
      delta = -event.deltaY
    } else if ('deltaX' in event && event.deltaX !== 0) {
      delta = -event.deltaX
    }

    if (event.deltaMode === 1 /* LINE */) {
      // Pick sensible scroll amount based on if user scrolling fast or slow.
      var lines = Math.abs(event.deltaY)
      var scroll = lines > 2 ? 40 : lines * 10
      k = Math.pow(2, delta * scroll / 500)
    } else {
      k = delta * (event.deltaMode ? scrollLineHeight : 1) / 500
    }
    return k
  }

  _nopropagation (event) {
    event.preventDefault() // Cancel the event
    event.stopPropagation() // Don't bubble
  }

  _handleEvent (coordinates, mouseEvent) {
    this._nopropagation(mouseEvent)

    const wheelDelta = this._defaultWheelDelta(mouseEvent)
    const event = { wheelDelta, coordinates: coordinates, originalEvent: mouseEvent }
    const sectionBbox = this._interactionManager._section

    if (this._isInSection(coordinates, sectionBbox)) {
      this._callback(event)
    }
  }
}
