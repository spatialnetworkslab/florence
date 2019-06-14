import SpatialIndex from './SpatialIndex.js'
import ClickManager from './ClickManager.js'
import HoverManager from './HoverManager.js'

export default class InteractionManager {
  constructor () {
    this._spatialIndex = new SpatialIndex()

    this._id = undefined
    this._eventManager = undefined

    this._clickManager = new ClickManager(this)
    this._hoverManager = new HoverManager(this)
  }

  // Initialization
  setId (sectionId) {
    this._id = sectionId
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }

  // Layer loading and removing
  loadLayer (layerType, layerData) {
    this._spatialIndex.loadLayer(layerType, layerData)
  }

  layerIsLoaded (layerId) {
    return this._spatialIndex.layerIsLoaded(layerId)
  }

  removeLayer (layerId) {
    this._spatialIndex.removeLayer(layerId)
  }

  // Add/remove interactions
  addInteraction (interactionName, layerId, callback) {
    if (interactionName === 'click') this._clickManager.addInteraction(layerId, callback)
    if (interactionName === 'hover') this._hoverManager.addInteraction(layerId, callback)
  }

  removeInteraction (interactionName, layerId) {
    if (interactionName === 'click') this._clickManager.removeInteraction(layerId)
    if (interactionName === 'hover') this._hoverManager.removeInteraction(layerId)
  }
}
