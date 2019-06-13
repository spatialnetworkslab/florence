import SpatialIndex from './SpatialIndex.js'

export default class InteractionManager {
  constructor () {
    this._spatialIndex = new SpatialIndex()

    this._id = undefined
    this._eventManager = undefined
    this._sectionContext = undefined

    this._layers = {}

    this._clickTracker = new InteractionTracker(this, 'click')
    this._hoverTracker = new InteractionTracker(this, 'hover')
  }

  // Initialization
  setId (sectionId) {
    this._id = sectionId
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }

  setSectionContext (sectionContext) {
    this._sectionContext = sectionContext
  }

  // Layer loading and removing
  loadLayer (layerId, layerType, layerData) {
    this._spatialIndex.loadLayer(layerId, layerType, layerData)
    this._layers[layerId] = true
  }

  layerIsLoaded (layerId) {
    return this._layers[layerId] !== undefined
  }

  removeLayer (layerId) {
    this._spatialIndex.removeLayer(layerId)
    delete this._layers[layerId]
  }

  // Add/remove interactions
  addInteraction () {
    
  }

  removeInteraction () {

  }
}

class InteractionTracker {
  constructor (intera) {

  }
}
