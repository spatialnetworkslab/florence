import BaseEventManager from './BaseEventManager.js'
import capitalize from '../../utils/capitalize.js'

export default class MouseEventManager extends BaseEventManager {
  constructor () {
    super(EXPOSED_EVENTS, 'mouse')
  }

  _getNativeMouseEventName (exposedEventName, BROWSER_TYPE) {
    // 'click' has the same name in every non-mobile browser
    if (exposedEventName === 'click') return 'click'

    // 'wheel' has the same name in every non-mobile browser
    if (exposedEventName === 'wheel') return 'wheel'

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

  _getScreenCoordinates (nativeEvent) {
    this._svgPoint.x = nativeEvent.clientX
    this._svgPoint.y = nativeEvent.clientY

    return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
  }
}

const EVENT_NAMES = ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'click', 'wheel']
const WINDOW_EVENTS = ['mousemove', 'mouseup']
const PREVENT_DEFAULT = ['mousedown']

const EXPOSED_EVENTS = EVENT_NAMES.map(eventName => ({
  eventName,
  nativeEventName: undefined,
  useWindow: WINDOW_EVENTS.includes(eventName),
  preventDefault: PREVENT_DEFAULT.includes(eventName)
}))

const sliceOffMouse = str => str.slice(5, str.length)
