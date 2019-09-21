export default class BaseInteractionManager {
  constructor () {
    this._id = undefined
    this._eventManager = undefined

    this._section = undefined
    this._coordinateTransformation = undefined
    this._zoom = undefined

    this._markInteractionInterface = undefined
    this._sectionInteractionInterface = undefined
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
    return this._markInteractionInterface
  }

  // Section interactions interface
  section () {
    return this._sectionInteractionInterface
  }
}
