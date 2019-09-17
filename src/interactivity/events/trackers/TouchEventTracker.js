import EventTracker from './EventTracker.js'
import { getNativeTouchEventName } from '../utils/getNativeEventName.js'

export class MouseEventTracker extends EventTracker {
  constructor (eventManager, eventName) {
    const useWindow = eventName === 'touchmove'
    super(eventManager, eventName, getNativeTouchEventName, useWindow)
  }

  _getScreenCoordinates (nativeEvent) {
    // TODO
  }
}
