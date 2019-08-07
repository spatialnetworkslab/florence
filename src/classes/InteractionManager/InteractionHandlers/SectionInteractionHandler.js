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

  removeSectionInteraction () {
    this._removeEventListener()
    this._callback = undefined
  }

  _isInSection (hit, geometry) {
    const xRange = [geometry.x1, geometry.x2].sort((a, b) => a - b)
    const yRange = [geometry.y1, geometry.y2].sort((a, b) => a - b)

    if (hit.x <= xRange[1] && hit.x >= xRange[0] && hit.y <= yRange[1] && hit.y >= yRange[0]) {
      return true
    }
    return false
  }
}
