import detectIt from 'detect-it'

import MouseInteractionManager from './mouse/MouseInteractionManager.js'
import TouchInteractionManager from './touch/TouchInteractionManager.js'

export default class InteractionManager {
  constructor () {
    if (detectIt.hasMouse) {
      this._mouseInteractionManager = new MouseInteractionManager()
    }

    if (detectIt.hasTouch) {
      this._touchInteractionManager = new TouchInteractionManager()
    }
  }

  mouse () {
    return this._mouseInteractionManager
  }

  touch () {
    return this._touchInteractionManager
  }
}
