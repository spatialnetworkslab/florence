import SpatialIndex from '../SpatialIndex.js'

export default class InteractionHandler {
  constructor (interactionManager) {
    console.log(interactionManager)
    this._interactionManager = interactionManager
    this._callback = undefined
  }

  // Add/remove layer interactions
  addSectionInteraction (sectionId, callback) {
    if (!this._callback && this._id) {
      this._callback = callback
      this._id = sectionId
      this._addEventListenerIfNecessary()
      this._numberOfInteractions++
    }
  }

  removeSectionInteraction (sectionId) {
    if (this._sectionCallbacks.hasOwnProperty(sectionId)) {
      this._numberOfInteractions--
      delete this._sectionCallbacks[sectionId]
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
