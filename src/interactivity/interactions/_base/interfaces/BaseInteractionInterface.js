import capitalize from '../../../../utils/capitalize.js'

export default class BaseInteractionInterface {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._handlers = {}
  }

  _getHandler (interactionName) {
    const handlerName = interactionNameToHandlerName(interactionName)
    return this._handlers[handlerName]
  }
}

const interactionNameToHandlerName = interactionName => {
  return capitalize(interactionName) + 'Handler'
}
