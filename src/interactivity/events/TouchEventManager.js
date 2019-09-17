import EventManager from './EventManager.js'
import TouchEventTracker from './TouchEventTracker.js'

const EXPOSED_EVENTS = [
  'touchstart', 'touchend', 'touchmove', 'touchcancel'
]

export default class MouseEventManager extends EventManager {
  constructor () {
    super(EXPOSED_EVENTS, TouchEventTracker)
  }
}
