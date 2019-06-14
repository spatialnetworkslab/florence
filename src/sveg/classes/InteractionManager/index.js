import SpatialIndex from './SpatialIndex.js'
import ClickHandler from './InteractionHandlers/ClickHandler.js'
import HoverHandler from './InteractionHandlers/HoverHandler.js'

export default class InteractionManager {
  constructor () {
    this._spatialIndex = new SpatialIndex()

    this._id = undefined
    this._eventManager = undefined

    this._clickHandler = new ClickHandler(this)
    this._hoverHandler = new HoverHandler(this)
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
    if (interactionName === 'click') this._clickHandler.addLayerInteraction(layerId, callback)
    if (interactionName === 'hover') this._hoverHandler.addLayerInteraction(layerId, callback)
  }

  removeAllLayerInteractions (layerId) {
    this._clickHandler.removeLayerInteraction(layerId)
    this._hoverHandler.removeLayerInteraction(layerId)
  }

  // Add/remove mark interactions
  addMarkInteraction (interactionName) {
    if (interactionName === 'click') this._clickHandler.addMarkInteraction()
    if (interactionName === 'hover') this._hoverHandler.addMarkInteraction()
  }

  removeAllMarkInteractions () {
    this._clickHandler.removeMarkInteraction()
    this._hoverHandler.removeMarkInteraction()
  }
}
