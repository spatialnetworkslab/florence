import EventManager from './EventManager.js'
import MouseEventTracker from './trackers/MouseEventTracker.js/index.js'

const EXPOSED_EVENTS = [
  'mousedown', 'mouseup', 'mousemove', 'mouseout', 'click', 'zoom'
]

export default class MouseEventManager extends EventManager {
  constructor () {
    super(EXPOSED_EVENTS, MouseEventTracker)
  }
}
