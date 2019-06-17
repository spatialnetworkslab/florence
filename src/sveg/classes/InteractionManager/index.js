import ClickHandler from './InteractionHandlers/ClickHandler.js'
import HoverHandler from './InteractionHandlers/HoverHandler.js'
import { markIndexing, layerIndexing } from './indexingFunctions'

export default class InteractionManager {
  constructor () {
    this._layers = {}
    this._marks = {}

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
    let indexingFunction = layerIndexing[layerType]
    let indexableData = indexingFunction(layerData)

    let layerId = layerData.layerId
    this._layers[layerId] = indexableData
  }

  layerIsLoaded (layerId) {
    return this._layers.hasOwnProperty(layerId)
  }

  removeLayer (layerId) {
    delete this._layers[layerId]
  }

  // Mark loading and removing
  loadMark (markType, markData) {
    let indexingFunction = markIndexing[markType]
    let indexableItem = indexingFunction(markData)

    let markId = markData.markId
    this._marks[markId] = indexableItem
  }

  markIsLoaded (markId) {
    return this._marks.hasOwnProperty(markId)
  }

  removeMark (markId) {
    delete this._marks[markId]
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
