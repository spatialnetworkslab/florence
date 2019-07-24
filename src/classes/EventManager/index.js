let handler

export default class EventManager {
  constructor () {
    this._mounted = false

    this._mousemoveTracker = new EventTracker(this, 'mousemove')
    this._mousedownTracker = new EventTracker(this, 'mousedown')
    this._mouseupTracker = new EventTracker(this, 'mouseup')

    this._listeners = {}
  }

  addRootNode (domNode) {
    this._domNode = domNode
    this._svgPoint = this._domNode.createSVGPoint()
    this._mounted = true
  }

  attachEventListeners () {
    if (this._mounted) {
      for (const listenerId in this._listeners) {
        const { eventName, callback } = this._listeners[listenerId]
        const tracker = this[getTrackerName(eventName)]
        tracker.addEventListener(listenerId, callback)
      }
    } else {
      // you should really only call this when mounted
    }
  }

  addEventListener (eventName, listenerId, callback) {
    this._listeners[listenerId] = Object.assign({}, { eventName, callback })
    if (this._mounted) {
      const tracker = this[getTrackerName(eventName)]
      tracker.addEventListener(listenerId, callback)
    }
  }

  removeEventListener (eventName, listenerId) {
    delete this._listeners[listenerId]
    const tracker = this[getTrackerName(eventName)]
    tracker.removeEventListener(listenerId)
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

  addEventListener (listenerId, callback) {
    if (this._numberOfListeners === 0) {
      handler = this._handleEvent.bind(this)
      this._eventManager._domNode.addEventListener(this._eventName, handler)
    }

    this._numberOfListeners++
    this._callbacks[listenerId] = callback
  }

  removeEventListener (listenerId) {
    this._numberOfListeners--
    delete this._callbacks[listenerId]

    if (this._numberOfListeners === 0) {
      this._eventManager._domNode.removeEventListener(this._eventName, handler)
    }
  }

  _handleEvent (mouseEvent) {
    const coordinates = this._eventManager._getMouseCoordinates(mouseEvent)

    for (const listenerId in this._callbacks) {
      this._callbacks[listenerId](coordinates, mouseEvent)
    }
  }
}

function getTrackerName (eventName) {
  const trackerName = eventNameToTrackerNameMap[eventName]

  if (trackerName) return trackerName
  throw new Error(`Invalid event name: '${eventName}`)
}

const eventNameToTrackerNameMap = {
  mousemove: '_mousemoveTracker',
  mousedown: '_mousedownTracker',
  mouseup: '_mouseupTracker'
}
