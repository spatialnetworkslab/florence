import InteractionHandler from './InteractionHandler.js'

export default class WheelHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
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

  _handleEvent (coordinates, mouseEvent) {
    let sections = this._interactionManager._sections

    if (Object.keys(sections).length > 0) {
      for (let s in sections) {
        if (this._isInSection(coordinates, sections[s])) {

          // Thinking of taking this object execution code out – would users possibly feed objects to the interactionManager?
          if (typeof this._sectionCallbacks[sections[s].sectionId] === 'object') {
            this._sectionCallbacks[sections[s].sectionId].callback(s.sectionId, mouseEvent)
          } else {
            this._sectionCallbacks[sections[s].sectionId](s.sectionId, mouseEvent)
          }
        }
      }
    }
  }
}
