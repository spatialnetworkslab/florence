import BaseEventManager from './BaseEventManager.js'
import capitalize from '../../utils/capitalize.js'

export default class TouchEventManager extends BaseEventManager {
  constructor () {
    super(EXPOSED_EVENTS)
  }
}

const EVENT_NAMES = ['touchstart', 'touchend', 'touchmove', 'touchcancel']

const EXPOSED_EVENTS = EVENT_NAMES.map(eventName => ({
  eventName,
  nativeEventName: getNativeTouchEventName(eventName),
  useWindow: eventName === 'touchmove'
}))

const BROWSER_TYPE = window.navigator.pointerEnabled
  ? 'IE11 / MSEdge'
  : window.navigator.msPointerEnabled
    ? 'IE10 / WP8'
    : 'other'

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
