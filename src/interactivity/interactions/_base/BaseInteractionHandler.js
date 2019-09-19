export default class BaseInteractionHandler {
  constructor (interactionManager, { eventName, interactionName }) {
    this._interactionManager = interactionManager
    this._eventName = eventName
    this._interactionName = interactionName
  }

  interactionManager () {
    return this._interactionManager
  }

  eventManager () {
    return this._interactionManager._eventManager
  }

  section () {
    return this._interactionManager._section
  }

  id () {
    return this._interactionManager._id
  }

  _addEventListener () {
    const handler = this._handleEvent.bind(this)

    const eventManager = this.eventManager()
    const listenerId = this.getId()

    eventManager
      .eventTracker(this._eventName)
      .addListener(listenerId, handler)
  }

  _removeEventListener () {
    const eventManager = this.eventManager()
    const listenerId = this.getId()

    eventManager
      .eventTracker(this._eventName)
      .removeListener(listenerId)
  }
}
