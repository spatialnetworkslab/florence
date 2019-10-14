import BaseEventManager from './BaseEventManager.js'
import capitalize from '../../utils/capitalize.js'

export default class TouchEventManager extends BaseEventManager {
  constructor () {
    super(EXPOSED_EVENTS)
  }

  _getScreenCoordinates (nativeEvent) {
    const targetTouches = nativeEvent.targetTouches
    const changedTouches = nativeEvent.changedTouches

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
      // to handle pinch and other multi touch gestures
    }

    return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
  }
}

const BROWSER_TYPE = window.navigator.pointerEnabled
  ? 'IE11 / MSEdge'
  : window.navigator.msPointerEnabled
    ? 'IE10 / WP8'
    : 'other'

const EVENT_NAMES = ['touchstart', 'touchend', 'touchmove', 'touchcancel']

const EXPOSED_EVENTS = EVENT_NAMES.map(eventName => ({
  eventName,
  nativeEventName: getNativeTouchEventName(eventName),
  useWindow: eventName === 'touchmove'
}))

function getNativeTouchEventName (exposedEventName) {
  // In this mobile browser type, events are called 'pointerup' etc
  if (BROWSER_TYPE === 'IE11 / MSEdge') {
    const lastPart = sliceOffTouch(exposedEventName)
    return 'pointer' + lastPart
  }

  // In this mobile browser type, events are called 'MSPointerUp' etc
  if (BROWSER_TYPE === 'IE10 / WP8') {
    const lastPart = sliceOffTouch(exposedEventName)
    return 'MSPointer' + capitalize(lastPart)
  }

  // In other mobile browsers, events are called like the exposed ones
  if (BROWSER_TYPE === 'other') {
    return exposedEventName
  }
}

const sliceOffTouch = str => str.slice(5, str.length)
