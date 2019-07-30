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

  _defaultWheelDelta (event) {
    // normalised for all browsers
    return -event.deltaY * (event.deltaMode ? scrollLineHeight : 1) / 500
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
