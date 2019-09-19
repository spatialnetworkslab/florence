import BaseSectionInteractionInterface from '../../_base/interfaces/BaseSectionInteractionInterface.js'
import * as InteractionHandlers from './InteractionHandlers'

export default class SectionInteractionInterface extends BaseSectionInteractionInterface {
  constructor (interactionManager) {
    super(interactionManager, InteractionHandlers)
  }
}
