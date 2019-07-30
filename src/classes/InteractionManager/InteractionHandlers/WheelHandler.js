import SectionInteractionHandler from './SectionInteractionHandler.js'

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._callback) {
      const handler = this._handleEvent.bind(this)
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-wheel'
      eventManager.addEventListener('wheel', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-wheel'

      eventManager.removeEventListener('wheel', listenerId)
    }
  }

  _defaultWheelDelta (event) {
    // normalised for all browsers
    // based on d3
    return -event.deltaY * (event.deltaMode ? 120 : 1) / 500;
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
