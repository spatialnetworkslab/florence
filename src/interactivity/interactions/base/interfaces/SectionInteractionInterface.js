import BaseInteractionInterface from './BaseInteractionInterface.js'

export default class SectionInteractionInterface extends BaseInteractionInterface {
  addInteraction (interactionName, callback) {
    this._getHandler(interactionName).addInteraction(callback)
  }

  removeAllInteractions () {
    for (const handlerName in this._handlers) {
      const handler = this._handlers[handlerName]

      if (handler.hasInteraction()) {
        handler.removeInteraction()
      }
    }
  }
}
