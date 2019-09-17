export default class MouseEventManager {
  constructor (EXPOSED_EVENTS, EventTracker) {
    this._domNode = undefined
    this._svgPoint = undefined
    this._mounted = false
    this._trackers = {}

    for (const eventName of EXPOSED_EVENTS) {
      this._trackers[eventName] = new EventTracker(this, eventName)
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
