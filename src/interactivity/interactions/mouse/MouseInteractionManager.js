import MarkInteractionManager from './mark/MarkInteractionManager.js.js'
import SectionInteractionManager from './section/SectionInteractionManager.js'

export default class MouseInteractionManager {
  constructor () {
    this._id = undefined
    this._eventManager = undefined

    this._section = undefined
    this._coordinateTransformation = undefined
    this._zoom = undefined

    this._markInteractionManager = new MarkInteractionManager(this)
    this._sectionInteractionManager = new SectionInteractionManager(this)
  }

  // Initialization
  setId (id) {
    this._id = id
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }

  // Section context loading
  loadSection (sectionData) {
    this._section = sectionData
  }

  loadCoordinateTransformation (coordinateTransformation) {
    this._coordinateTransformation = coordinateTransformation
  }

  loadZoom (zoom) {
    this._zoom = zoom
  }

  // Mark and layer interactions interface
  marks () {
    return this._markInteractionManager
  }

  // Section interactions interface
  section () {
    return this._sectionInteractionManager
  }
}
