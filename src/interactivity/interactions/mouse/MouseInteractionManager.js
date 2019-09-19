import BaseInteractionManager from '../_base/managers/BaseInteractionManager.js'

import MarkInteractionInterface from './mark/MarkInteractionInterface.js'
import SectionInteractionInterface from './section/SectionInteractionInterface.js'

export default class MouseInteractionManager extends BaseInteractionManager {
  constructor () {
    super()

    this._markInteractionInterface = new MarkInteractionInterface(this)
    this._sectionInteractionInterface = new SectionInteractionInterface(this)
  }
}
