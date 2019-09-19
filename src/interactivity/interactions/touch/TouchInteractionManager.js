import BaseInteractionManager from '../_base/managers/BaseInteractionManager.js'

// import MarkInteractionInterface from './mark/MarkInteractionInterface.js'
// import SectionInteractionInterface from './section/SectionInteractionInterface.js'

export default class TouchInteractionManager extends BaseInteractionManager {
  constructor () {
    super()

    this._ = null
    // this._markInteractionInterface = new MarkInteractionInterface(this)
    // this._sectionInteractionInterface = new SectionInteractionInterface(this)
  }
}
