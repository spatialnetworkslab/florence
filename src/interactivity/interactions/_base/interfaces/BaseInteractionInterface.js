import capitalize from '../../../../utils/capitalize.js'

export default class BaseInteractionInterface {
  constructor (interactionManager, InteractionHandlers) {
    this._interactionManager = interactionManager
    this._handlers = {}

    for (const handlerName in InteractionHandlers) {
      this._handlers[handlerName] = new InteractionHandlers[handlerName](this._interactionManager)
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
