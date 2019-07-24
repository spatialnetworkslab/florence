import SectionInteractionHandler from './SectionInteractionHandler.js'

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._callback) {
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-wheel'
      eventManager.addEventListener('wheel', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-wheel'

      eventManager.removeEventListener('wheel', listenerId)
    }
  }

  _defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode ? 120 : 1) / 500;
  }

  _nopropagation(event) {
    event.preventDefault(); // Cancel the event
    event.stopPropagation() // Don't bubble
  }

  _handleEvent (coordinates, mouseEvent) {
    this._nopropagation(mouseEvent)

    const wheelDelta = this._defaultWheelDelta(mouseEvent)
    const mouse = {x: coordinates.x, y: coordinates.y}
    const evt = {wheelDelta, mouse}
    let interactionManager = this._interactionManager
    let id = interactionManager._id 

    // what other information would the user need? 
    let sectionBbox = interactionManager._sections[id]

    if (this._isInSection(coordinates, sectionBbox)){
      this._callback(id, evt)
    }
    //console.log(mouseEvent)
    // if (Object.keys(sections).length > 0) {
    //   for (let s in sections) {
    //     if (this._isInSection(coordinates, sections[s])) {

    //       // Thinking of taking this object execution code out – would users possibly feed objects to the interactionManager?
    //       if (typeof this._sectionCallbacks[sections[s].sectionId] === 'object') {
    //         this._sectionCallbacks[sections[s].sectionId].callback(s.sectionId, mouseEvent)
    //       } else {
    //         this._sectionCallbacks[sections[s].sectionId](s.sectionId, mouseEvent)
    //       }
    //     }
    //   }
    // }
  }
}
