let handler

export default class EventManager {
  constructor () {
    this._mounted = false

    let eventstart
    let eventend
    let eventmove
    let eventcancel
    let eventclick
    const wheel = 'wheel'

    // Pointer events for IE11 and MSEdge:
    if (window.navigator.pointerEnabled) {
      eventstart = 'pointerdown'
      eventend = 'pointerup'
      eventmove = 'pointermove'
      eventcancel = 'pointercancel'
      eventclick = 'click'
    // Pointer events for IE10 and WP8:
    } else if (window.navigator.msPointerEnabled) {
      eventstart = 'MSPointerDown'
      eventend = 'MSPointerUp'
      eventmove = 'MSPointerMove'
      eventcancel = 'MSPointerCancel'
      eventclick = ['MSPointerDown', 'MSPointerUp']
    // Touch events for iOS & Android:
    } else if ('ontouchstart' in window) {
      eventstart = 'touchstart'
      eventend = 'touchend'
      eventmove = 'touchmove'
      eventcancel = 'touchcancel'
      eventclick = 'click'
    // Mouse events for desktop:
    } else {
      eventstart = 'mousedown'
      eventend = 'mouseup'
      eventmove = 'mousemove'
      eventcancel = 'mouseout'
      eventclick = 'click'
    }
    
    this._normalisedEvents = { eventstart, eventend, eventmove, eventcancel, eventclick, wheel }

    // Desktop
    this._clickTracker = new EventTracker(this, 'click')
    this._mousemoveTracker = new EventTracker(this, 'mousemove')
    this._mousedownTracker = new EventTracker(this, 'mousedown')
    this._mouseupTracker = new EventTracker(this, 'mouseup')
    this._wheelTracker = new EventTracker(this, 'wheel')

    // Touch
    this._touchstartTracker = new EventTracker(this, 'touchstart')
    this._touchmoveTracker = new EventTracker(this, 'touchmove')
    this._touchendTracker = new EventTracker(this, 'touchend')
    this._touchcancelTracker = new EventTracker(this, 'touchcancel')

    // Pointer
    this._pointerstartTracker = new EventTracker(this, 'pointerdown')
    this._pointermoveTracker = new EventTracker(this, 'pointermove')
    this._pointerendTracker = new EventTracker(this, 'pointerup')
    this._pointercancelTracker = new EventTracker(this, 'pointercancel')

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
        const nativeEvent = this._normalisedEvents[eventName]
        const tracker = this[getTrackerName(nativeEvent)]
        tracker.addEventListener(listenerId, callback)
      }
    } else {
      // you should really only call this when mounted
    }
  }

  addEventListener (eventName, listenerId, callback) {
    this._listeners[listenerId] = Object.assign({}, { eventName, callback })
    if (this._mounted) {
      const nativeEvent = this._normalisedEvents[eventName]
      const tracker = this[getTrackerName(nativeEvent)]
      tracker.addEventListener(listenerId, callback)
    }
  }

  removeEventListener (eventName, listenerId) {
    delete this._listeners[listenerId]
    const nativeEvent = this._normalisedEvents[eventName]
    const tracker = this[getTrackerName(nativeEvent)]
    tracker.removeEventListener(listenerId)
  }

  _getCoordinates (event) {
    // desktop
    if (event.type.includes('mouse')) {
      this._getDesktopCoordinates(event)
    } else if (event.type.includes('touch')) {
      // One finger: pan
      // Two fingers: zoom, other gestures

      // Note: For multi touch events need to acess both targetTouches and changedTouches
      // to create gestures
      this._getMobileCoordinates(event)
    }

    return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
  }

  _getDesktopCoordinates (event) {
    this._svgPoint.x = event.clientX
    this._svgPoint.y = event.clientY
  }

  _getMobileCoordinates (event) {
    const targetTouches = event.targetTouches
    const changedTouches = event.changedTouches

    if (targetTouches.length === 1 || changedTouches.length === 1) {
      if (targetTouches[0]) {
        const targetTouch = targetTouches[0]
        this._svgPoint.x = targetTouch.clientX
        this._svgPoint.y = targetTouch.clientY
      }

      if (changedTouches[0]) {
        const changedTouch = changedTouches[0]
        this._svgPoint.x = changedTouch.clientX
        this._svgPoint.y = changedTouch.clientY
      }
    } else if (targetTouches.length > 1 || changedTouches.length > 1) {
      // hold space
    }
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

      if (listenerId.includes('move')) {
        window.addEventListener(this._eventName, handler)
      } else {
        this._eventManager._domNode.addEventListener(this._eventName, handler)
      }
    }

    this._numberOfListeners++
    this._callbacks[listenerId] = callback
  }

  removeEventListener (listenerId) {
    this._numberOfListeners--
    delete this._callbacks[listenerId]

    if (listenerId.includes('move')) {
      window.removeEventListener(this._eventName, handler)
    } else {
      if (this._numberOfListeners === 0) {
        this._eventManager._domNode.removeEventListener(this._eventName, handler)
      }
    }
  }

  _handleEvent (event) {
    const coordinates = this._eventManager._getCoordinates(event)

    for (const listenerId in this._callbacks) {
      this._callbacks[listenerId](coordinates, event)
    }
  }
}

function getTrackerName (eventName) {
  const trackerName = eventNameToTrackerNameMap[eventName]

  if (trackerName) return trackerName
  throw new Error(`Invalid event name: '${eventName}'`)
}

const eventNameToTrackerNameMap = {
  click: '_clickTracker',
  mousemove: '_mousemoveTracker',
  mousedown: '_mousedownTracker',
  mouseup: '_mouseupTracker',
  wheel: '_wheelTracker',
  touchstart: '_touchstartTracker',
  touchmove: '_touchmoveTracker',
  touchend: '_touchendTracker',
  touchcancel: '_touchcancelTracker',
  pointerdown: '_pointerdown',
  pointerup: '_pointerup',
  pointermove: '_pointermove',
  pointercancel: '_pointercancel'
}
