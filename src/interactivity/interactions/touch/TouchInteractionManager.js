import BaseInteractionManager from '../base/managers/BaseInteractionManager.js'
import MarkInteractionInterface from '../base/interfaces/MarkInteractionInterface.js'
import SectionInteractionInterface from '../base/interfaces/SectionInteractionInterface.js'

import * as MarkInteractionHandlers from './mark'
import * as SectionInteractionHandlers from './section'

export default class TouchInteractionManager extends BaseInteractionManager {
  constructor () {
    super()

    this._markInteractionInterface = new MarkInteractionInterface(this, MarkInteractionHandlers)
    this._sectionInteractionInterface = new SectionInteractionInterface(this, SectionInteractionHandlers)
  }
}
