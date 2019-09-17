const EVENTS = []

export default class TouchEventManager {
  constructor () {
    this._trackers = {}
  }

  eventTracker (eventName) {

  }
}

class EventTracker {
  constructor (eventManager, eventName) {
    this._eventManager = eventManager
    this._eventName = eventName

    this._numberOfListeners = 0
    this._callbacks = {}
  }
}
