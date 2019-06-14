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

  // Mark loading and removing
  loadMark (markType, markData) {
    this._spatialIndex.loadMark(markType, markData)
  }

  markIsLoaded (markId) {
    return this._spatialIndex.markIsLoaded(markId)
  }

  removeMark (markId) {
    this._spatialIndex.removeMark(markId)
  }

  // Add/remove layer interactions
  addLayerInteraction (interactionName, layerId, callback) {
    if (interactionName === 'click') this._clickManager.addLayerInteraction(layerId, callback)
    if (interactionName === 'hover') this._hoverManager.addLayerInteraction(layerId, callback)
  }

  removeAllLayerInteractions (layerId) {
    this._clickManager.removeLayerInteraction(layerId)
    // this._hoverManager.removeLayerInteraction(layerId)
  }

  // Add/remove mark interactions
  addMarkInteraction (interactionName) {
    if (interactionName === 'click') this._clickManager.addMarkInteraction()
    if (interactionName === 'hover') this._hoverManager.addMarkInteraction()
  }

  removeAllMarkInteractions () {
    this._clickManager.removeMarkInteraction()
    // this._hoverManager.removeMarkInteraction()
  }
}
