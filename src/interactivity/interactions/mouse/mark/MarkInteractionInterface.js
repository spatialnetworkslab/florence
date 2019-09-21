import BaseMarkInteractionInterface from '../../_base/interfaces/BaseMarkInteractionInterface.js'
import * as InteractionHandlers from './InteractionHandlers'

export default class MarkInteractionInterface extends BaseMarkInteractionInterface {
  constructor (interactionManager) {
    super(interactionManager, InteractionHandlers)
  }
}
