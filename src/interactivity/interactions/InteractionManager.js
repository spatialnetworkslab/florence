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

  // Initialization
  setId (id) {
    this._forEachManager(manager => { manager.setId(id) })
  }

  linkEventManager (eventManager) {
    if (this._mouseInteractionManager) {
      this._mouseInteractionManager.linkEventManager(eventManager.mouse())
    }

    if (this._touchInteractionManager) {
      this._touchInteractionManager.linkEventManager(eventManager.touch())
    }
  }

  // Section context loading
  loadSection (sectionData) {
    this._forEachManager(manager => { manager.loadSection(sectionData) })
  }

  loadCoordinateTransformation (coordinateTransformation) {
    this._forEachManager(manager => { manager.loadCoordinateTransformation(coordinateTransformation) })
  }

  loadZoom (zoom) {
    this._forEachManager(manager => { manager.loadZoom(zoom) })
  }

  mouse () {
    return this._mouseInteractionManager
  }

  touch () {
    return this._touchInteractionManager
  }

  _forEachManager (callback) {
    if (this._mouseInteractionManager) callback(this._mouseInteractionManager)
    if (this._touchInteractionManager) callback(this._touchInteractionManager)
  }
}
