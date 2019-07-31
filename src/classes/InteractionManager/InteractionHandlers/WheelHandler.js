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

  // normalised for most browsers, trackpads and mouses
  // based on openstreemtmaps: https://github.com/openstreetmap/iD/blob/f61c482188b1b747fdf528ac2992f6ed9e8a2b6a/modules/renderer/map.js#L376-L396
  // and normalize-wheel: https://github.com/basilfx/normalize-wheel/blob/master/src/normalizeWheel.js
  // Enables side scroll and up down scroll
  _defaultWheelDelta (event) {
    let delta

    if ('deltaY' in event && event.deltaY !== 0) {
      delta = -event.deltaY
    } else if ('deltaX' in event && event.deltaX !== 0) {
      delta = -event.deltaX
    }

    return delta * (event.deltaMode ? scrollLineHeight : 1) / 500
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
