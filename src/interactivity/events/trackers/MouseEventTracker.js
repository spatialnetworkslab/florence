import EventTracker from './EventTracker.js'
import { getNativeMouseEventName } from '../utils/getNativeEventName.js'

export class MouseEventTracker extends EventTracker {
  constructor (eventManager, eventName) {
    const useWindow = eventName === 'mousemove'
    super(eventManager, eventName, getNativeMouseEventName, useWindow)
  }

  _getScreenCoordinates (nativeEvent) {
    const svgPoint = this._eventManager._svgPoint
    const domNode = this._eventManager._domNode

    svgPoint.x = nativeEvent.clientX
    svgPoint.y = nativeEvent.clientY

    return svgPoint.matrixTransform(domNode.getScreenCTM().inverse())
  }
}
