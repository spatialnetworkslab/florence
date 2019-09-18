import EventManager from './EventManager.js'

export default class MouseEventManager extends EventManager {
  constructor () {
    super(EXPOSED_EVENTS)
  }
}

const EVENT_NAMES = ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'click', 'zoom']

const EXPOSED_EVENTS = EVENT_NAMES.map(eventName => ({
  eventName,
  nativeEventName: getNativeMouseEventName(eventName),
  useWindow: eventName === 'mousemove'
}))

const BROWSER_TYPE = window.navigator.pointerEnabled
  ? 'IE11 / MSEdge'
  : window.navigator.msPointerEnabled
    ? 'IE10 / WP8'
    : 'other'

export function getNativeMouseEventName (exposedEventName) {
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
