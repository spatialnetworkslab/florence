let handler

export default class EventManager {
  constructor () {
    this._mounted = false

    this._clickTracker = new EventTracker(this, 'click')
    this._mousemoveTracker = new EventTracker(this, 'mousemove')
    this._mousedownTracker = new EventTracker(this, 'mousedown')
    this._mouseupTracker = new EventTracker(this, 'mouseup')
    this._wheelTracker = new EventTracker(this, 'wheel')
    this._touchstartTracker = new EventTracker(this, 'touchstart')
    this._touchmoveTracker = new EventTracker(this, 'touchmove')
    this._touchendTracker = new EventTracker(this, 'touchend')
    this._touchcancelTracker = new EventTracker(this, 'touchcancel')

    this._listeners = {}

    // consult `navigator` to know if mobile or desktop browser
    this._isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
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

  _getMouseCoordinates (event) {
    if (!this._isMobile) {
      // desktop
      this._getDesktopCoordinates(event)
    } else if (this._isMobile) {
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
    
    if (targetTouches.length == 1 || changedTouches.length == 1) {
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

  _handleEvent (event) {
    const coordinates = this._eventManager._getMouseCoordinates(event)

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

// function checkBrowser (a, b){
//   if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))window.location=b})
//   (navigator.userAgent||navigator.vendor||window.opera,'http://detectmobilebrowser.com/mobile');

const eventNameToTrackerNameMap = {
  click: '_clickTracker',
  mousemove: '_mousemoveTracker',
  mousedown: '_mousedownTracker',
  mouseup: '_mouseupTracker',
  wheel: '_wheelTracker',
  touchstart: '_touchstartTracker',
  touchmove: '_touchmoveTracker',
  touchend: '_touchendTracker',
  touchcancel: '_touchcancelTracker'
}
