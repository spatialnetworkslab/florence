import BaseInteractionInterface from './BaseInteractionInterface.js'

export default class SectionInteractionInterface extends BaseInteractionInterface {
  constructor (interactionManager, InteractionHandlers) {
    super(interactionManager)

    this._handlers = InteractionHandlers
  }

  addInteraction (interactionName, callback) {
    this._getHandler(interactionName).addInteraction(callback)
  }

  removeAllInteractions () {
    for (const handlerName in this._handlers) {
      this._handlers[handlerName].removeInteraction()
    }
  }
}
