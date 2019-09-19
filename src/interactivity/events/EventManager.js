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

  // Initialization
  addRootNode (domNode) {
    this._forEachManager(manager => { manager.addRootNode(domNode) })
  }

  attachEventListeners () {
    this._forEachManager(manager => { manager.attachEventListeners() })
  }

  mouse () {
    return this._mouseEventManager
  }

  touch () {
    return this._touchEventManager
  }

  _forEachManager (callback) {
    if (this._mouseEventManager) callback(this._mouseEventManager)
    if (this._touchEventManager) callback(this._touchEventManager)
  }
}
