import detectIt from 'detect-it'

import MouseEventManager from './MouseEventManager.js'
import TouchEventManager from './TouchEventManager.js'

export default class EventManager {
  constructor () {
    if (detectIt.hasMouse) {
      this._mouseEventManager = new MouseEventManager()
    }

    if (detectIt.hasTouch) {
      this._touchEventManager = new TouchEventManager()
    }
  }

  mouse () {
    return this._mouseEventManager
  }

  touch () {
    return this._touchEventManager
  }
}
