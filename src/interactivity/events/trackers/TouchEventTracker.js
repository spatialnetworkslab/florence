import EventTracker from './EventTracker.js'
import { getNativeTouchEventName } from '../utils/getNativeEventName.js'

export class MouseEventTracker extends EventTracker {
  constructor (eventManager, eventName) {
    super(eventManager, eventName, getNativeTouchEventName)

    this._useWindow = eventName === 'touchmove'
  }

  _getScreenCoordinates (nativeEvent) {
    // TODO
  }
}
