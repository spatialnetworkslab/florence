import EventManager from './EventManager.js'
import TouchEventTracker from './TouchEventTracker.js'

const EXPOSED_EVENTS = [
  // TODO
]

export default class MouseEventManager extends EventManager {
  constructor () {
    super(EXPOSED_EVENTS, TouchEventTracker)
  }
}
