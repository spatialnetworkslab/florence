import * as InteractionHandlers from './InteractionHandlers'
import capitalize from '../../../../utils/capitalize.js'

export default class SectionInteractionManager {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
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

  _getHandler (interactionName) {
    const handlerName = interactionNameToHandlerName(interactionName)
    return this._handlers[handlerName]
  }
}

const interactionNameToHandlerName = interactionName => {
  return capitalize(interactionName) + 'Handler'
}
