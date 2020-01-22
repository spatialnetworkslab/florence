import EventTracker from './EventTracker.js'

export default class BaseEventManager {
  constructor (EXPOSED_EVENTS, managerType) {
    this._domNode = undefined
    this._svgPoint = undefined
    this._mounted = false
    this._trackers = {}
    this._BROWSER_TYPE = undefined
    this._managerType = managerType

    for (const event of EXPOSED_EVENTS) {
      this._trackers[event.eventName] = new EventTracker(this, event)
    }
  }

  // Svelte can only bind to DOM nodes after initialization
  addRootNode (domNode) {
    this._domNode = domNode
    this._svgPoint = this._domNode.createSVGPoint()

    // set browser type only after mount
    this._BROWSER_TYPE = window.navigator.pointerEnabled
      ? 'IE11 / MSEdge'
      : window.navigator.msPointerEnabled
        ? 'IE10 / WP8'
        : 'other'

    this._mounted = true
  }

  attachEventListeners () {
    if (this._mounted === false) throw new Error('root node must be added first')

    for (const eventName in this._trackers) {
      // set native event names here, just before attaching actual listeners
      if (this._managerType === 'mouse') {
        this._trackers[eventName].setNativeEventName(this._getNativeMouseEventName(eventName, this._BROWSER_TYPE))
      }
      if (this._managerType === 'touch') {
        this._trackers[eventName].setNativeEventName(this._getNativeTouchEventName(eventName, this._BROWSER_TYPE))
      }

      this._trackers[eventName].attachAllListeners()
    }
  }

  eventTracker (eventName) {
    return this._trackers[eventName]
  }
}
