import BaseInteractionHandler from './BaseInteractionHandler.js'

export class SectionInteractionHandler extends BaseInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)
    this._callback = undefined
  }

  addInteraction (callback) {
    this._addEventListener()
    this._callback = callback
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
