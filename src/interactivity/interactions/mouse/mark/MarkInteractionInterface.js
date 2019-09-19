import BaseMarkInteractionInterface from '../../_base/interfaces/BaseInteractionInterface.js/index.js'
import * as InteractionHandlers from './InteractionHandlers'

export default class MarkInteractionInterface extends BaseMarkInteractionInterface {
  constructor (interactionManager) {
    super(interactionManager, InteractionHandlers)
  }
}
