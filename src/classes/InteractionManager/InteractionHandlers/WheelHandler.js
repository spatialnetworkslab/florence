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
      const listenerId = interactionManager._id + '-wheel'

      eventManager.removeEventListener('wheel', listenerId)
    }
  }

  _defaultWheelDelta (event) {
    // do some normalisation
    // based on d3
    return -event.deltaY * (event.deltaMode ? 120 : 1) / 500
  }

  _nopropagation (event) {
    event.preventDefault() // Cancel the event
    event.stopPropagation() // Don't bubble
  }

  _handleEvent (coordinates, mouseEvent) {
    this._nopropagation(mouseEvent)

    const wheelDelta = this._defaultWheelDelta(mouseEvent)
    const evt = { wheelDelta, coordinates: coordinates, originalEvent: mouseEvent }

    const interactionManager = this._interactionManager
    const id = interactionManager._id
    const sectionBbox = interactionManager._sections[id]

    // what other information would the user need?
    if (this._isInSection(coordinates, sectionBbox)) {
      this._callback(id, evt)
    }
  }
}
