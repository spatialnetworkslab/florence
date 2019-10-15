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

    const events = isArray(this._eventName) ? this._eventName : [this._eventName]

    for (const event of events) {
      eventManager
        .eventTracker(event)
        .addListener(listenerId, handler)
    }
  }

  _removeEventListener () {
    const eventManager = this.eventManager()
    const listenerId = this.getId()

    const events = isArray(this._eventName) ? this._eventName : [this._eventName]

    for (const event of events) {
      eventManager
        .eventTracker(event)
        .removeListener(listenerId)
    }
  }
}

function isArray (value) {
  return value.constructor === Array
}
