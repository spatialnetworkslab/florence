import BaseInteractionHandler from './BaseInteractionHandler.js'

export default class SectionInteractionHandler extends BaseInteractionHandler {
  constructor (interactionManager, options) {
    super(interactionManager, options)
    this._callback = undefined
  }

  addInteraction (callback) {
    this._addEventListener()
    this._callback = callback
  }

  hasInteraction () {
    return this._callback !== undefined
  }

  removeInteraction () {
    if (this._callback) {
      this._callback = undefined
      this._removeEventListener()
    }
  }

  getId () {
    return `${this.id()}-section-${this._interactionName}`
  }
}
