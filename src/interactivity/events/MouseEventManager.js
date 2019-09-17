export default class MouseEventManager {
  constructor () {
    this._trackers = {}

    for (const eventName of EXPOSED_EVENTS) {
      this._trackers[eventName] = new EventTracker(this, eventName)
    }
  }

  eventTracker (eventName) {
    return this._trackers[eventName]
  }
}

class EventTracker {
  constructor (eventManager, eventName) {
    this._eventManager = eventManager
    this._eventName = eventName
    this._nativeEventName = getNativeEventName(eventName)

    this._numberOfListeners = 0
    this._callbacks = {}
  }

  addListener (listenerId, callback) {
    if (this._numberOfListeners === 0) {
      // TODO
    }

    this._numberOfListeners++
    this._callbacks[listenerId] = callback
  }

  removeListener (listenerId) {
    this._numberOfListeners--
    delete this._callbacks[listenerId]

    if (this._numberOfListeners === 0) {
      // TODO
    }
  }

  _handleEvent (event) {
    const coordinates = this._eventManager._getCoordinates(event)

    for (const listenerId in this._callbacks) {
      this._callbacks[listenerId](coordinates, event)
    }
  }
}

const EXPOSED_EVENTS = [
  'mousedown', 'mouseup', 'mousemove', 'mouseout', 'click', 'zoom'
]

const BROWSER_TYPE = window.navigator.pointerEnabled
  ? 'IE11 / MSEdge'
  : window.navigator.msPointerEnabled
    ? 'IE10 / WP8'
    : 'other'

function getNativeEventName (exposedEventName) {
  // 'click' has the same name in every non-mobile browser
  if (exposedEventName === 'click') return 'click'

  // 'zoom' is called 'wheel' in all non-mobile browsers,
  // even for trackpad two-finger scroll
  if (exposedEventName === 'zoom') return 'wheel'

  // In this non-mobile browser type, events are called 'pointerup' etc
  if (BROWSER_TYPE === 'IE11 / MSEdge') {
    const lastPart = sliceOffMouse(exposedEventName)
    return 'pointer' + lastPart
  }

  // In this non-mobile browser type, events are called 'MSPointerUp' etc
  if (BROWSER_TYPE === 'IE10 / WP8') {
    const lastPart = sliceOffMouse(exposedEventName)
    return 'MSPointer' + capitalize(lastPart)
  }

  // In other non-mobile browsers, events are called like the exposed ones
  if (BROWSER_TYPE === 'other') {
    return exposedEventName
  }
}

const sliceOffMouse = str => str.slice(5, str.length)
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
