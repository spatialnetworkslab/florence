import EventTracker from './EventTracker.js'

export default class BaseEventManager {
  constructor (EXPOSED_EVENTS) {
    this._domNode = undefined
    this._svgPoint = undefined
    this._mounted = false
    this._trackers = {}

    for (const event of EXPOSED_EVENTS) {
      this._trackers[event.eventName] = new EventTracker(this, event)
    }
  }

  // Svelte can only bind to DOM nodes after initialization
  addRootNode (domNode) {
    this._domNode = domNode
    this._svgPoint = this._domNode.createSVGPoint()
    this._mounted = true
  }

  attachEventListeners () {
    if (this._mounted === false) throw new Error('root node must be added first')

    for (const eventName in this._trackers) {
      this._trackers[eventName].attachAllListeners()
    }
  }

  eventTracker (eventName) {
    return this._trackers[eventName]
  }
}
