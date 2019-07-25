export default class SectionInteractionHandler {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._callback = undefined
  }

  // Add/remove layer interactions
  addSectionInteraction (sectionId, callback) {
    if (this._callback === undefined && this._interactionManager._id === sectionId) {
      this._callback = callback
      this._id = sectionId
      this._addEventListenerIfNecessary()
    }
  }

  removeSectionInteraction (sectionId) {
    if (this._sectionCallbacks.hasOwnProperty(sectionId)) {
      this._callback = undefined
      this._removeEventListenerIfNecessary()
    }
  }

  _isInSection (hit, geometry) {
    if (hit.x <= geometry.x2 && hit.x >= geometry.x1 && hit.y <= geometry.y2 && hit.y >= geometry.y1) {
      return true
    }
    return false
  }
}
