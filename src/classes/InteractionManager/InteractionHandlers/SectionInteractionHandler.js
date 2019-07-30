export default class SectionInteractionHandler {
  constructor (interactionManager) {
    this._interactionManager = interactionManager
    this._callback = undefined
  }

  // Add/remove layer interactions
  addSectionInteraction (callback) {
    this._callback = callback
    this._addEventListener()
  }

  removeSectionInteraction (sectionId) {
    this._removeEventListener()
    this._callback = undefined
  }

  _isInSection (hit, geometry) {
    if (hit.x <= geometry.x2 && hit.x >= geometry.x1 && hit.y <= geometry.y2 && hit.y >= geometry.y1) {
      return true
    }
    return false
  }
}
