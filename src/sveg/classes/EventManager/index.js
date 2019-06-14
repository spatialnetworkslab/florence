let handler

export default class EventManager {
  constructor (domNode) {
    this._domNode = domNode
    this._svgPoint = this._domNode.createSVGPoint()

    this._clickTracker = new EventTracker(this, 'click')
    this._mousemoveTracker = new EventTracker(this, 'mousemove')
    this._mousedownTracker = new EventTracker(this, 'mousedown')
    this._mouseupTracker = new EventTracker(this, 'mouseup')
  }

  addEventListener (eventName, interactionManagerId, callback) {
    let tracker = this[getTrackerName(eventName)]
    tracker.addEventListener(interactionManagerId, callback)
  }

  removeEventListener (eventName, interactionManagerId) {
    let tracker = this[getTrackerName(eventName)]
    tracker.removeEventListener(interactionManagerId)
  }

  _getMouseCoordinates (mouseEvent) {
    this._svgPoint.x = mouseEvent.clientX
    this._svgPoint.y = mouseEvent.clientY

    return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
  }
}

class EventTracker {
  constructor (eventManager, eventName) {
    this._eventManager = eventManager
    this._eventName = eventName

    this._numberOfListeners = 0
    this._callbacks = {}
  }

  addEventListener (interactionManagerId, callback) {
    if (this._numberOfListeners === 0) {
      handler = this._handleEvent.bind(this)
      this._eventManager._domNode.addEventListener(this._eventName, handler)
    }

    this._numberOfListeners++
    this._callbacks[interactionManagerId] = callback
  }

  removeEventListener (interactionManagerId) {
    this._numberOfListeners--
    delete this._callbacks[interactionManagerId]

    if (this._numberOfListeners === 0) {
      this._eventManager._domNode.removeEventListener(this._eventName, handler)
    }
  }

  _handleEvent (mouseEvent) {
    let coordinates = this._eventManager._getMouseCoordinates(mouseEvent)

    for (let listenerId in this._callbacks) {
      this._callbacks[listenerId](coordinates, mouseEvent)
    }
  }
}

function getTrackerName (eventName) {
  let trackerName = eventNameToTrackerNameMap[eventName]

  if (trackerName) return trackerName
  throw new Error(`Invalid event name: '${eventName}`)
}

const eventNameToTrackerNameMap = {
  click: '_clickTracker',
  mousemove: '_mousemoveTracker',
  mousedown: '_mousedownTracker',
  mouseup: '_mouseupTracker'
}
