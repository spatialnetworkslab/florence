import ClickHandler from './InteractionHandlers/ClickHandler.js'
import MouseoverHandler from './InteractionHandlers/MouseoverHandler.js'
import MouseoutHandler from './InteractionHandlers/MouseoutHandler.js'
import WheelHandler from './InteractionHandlers/WheelHandler.js'
import { markIndexing, layerIndexing, sectionIndexing } from './indexingFunctions'

export default class InteractionManager {
  constructor () {
    this._sections = {}
    this._layers = {}
    this._marks = {}

    this._id = undefined
    this._eventManager = undefined

    this._clickHandler = new ClickHandler(this)
    this._mouseoverHandler = new MouseoverHandler(this)
    this._mouseoutHandler = new MouseoutHandler(this)
    this._wheelHandler = new WheelHandler(this)
  }

  // Initialization
  setId (id) {
    this._id = id
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }

  // Section loading and removing
  loadSection (sectionType, sectionData) {
    const indexingFunction = sectionIndexing[sectionType]
    const indexableData = indexingFunction(sectionData)

    const sectionId = sectionData.sectionId
    this._sections[sectionId] = indexableData
  }

  sectionIsLoaded (sectionId) {
    return sectionId in this._sections
  }

  removeSection (sectionId) {
    delete this._sections[sectionId]
  }

  // Layer loading and removing
  loadLayer (layerType, layerData) {
    const indexingFunction = layerIndexing[layerType]
    const indexableData = indexingFunction(layerData)

    const layerId = layerData.layerId
    this._layers[layerId] = indexableData
  }

  layerIsLoaded (layerId) {
    return layerId in this._layers
  }

  removeLayer (layerId) {
    delete this._layers[layerId]
  }

  // Mark loading and removing
  loadMark (markType, markData) {
    const indexingFunction = markIndexing[markType]
    const indexableItem = indexingFunction(markData)

    const markId = markData.markId
    this._marks[markId] = indexableItem
  }

  markIsLoaded (markId) {
    return markId in this._marks
  }

  removeMark (markId) {
    delete this._marks[markId]
  }

  // Add/remove section interactions
  addSectionInteraction (interactionName, sectionId, callback) {
    if (interactionName === 'click') this._clickHandler.addSectionInteraction(sectionId, callback)
    if (interactionName === 'mouseover') this._mouseoverHandler.addSectionInteraction(sectionId, callback)
    if (interactionName === 'mouseout') this._mouseoutHandler.addSectionInteraction(sectionId, callback)
    if (interactionName === 'wheel') this._wheelHandler.addSectionInteraction(sectionId, callback)
  }

  removeAllSectionInteractions (sectionId) {
    this._clickHandler.removeSectionInteraction(sectionId)
    this._mouseoverHandler.removeSectionInteraction(sectionId)
    this._mouseoutHandler.removeSectionInteraction(sectionId)
    this._wheelHandler.removeSectionInteraction(sectionId)
  }

  // Add/remove layer interactions
  addLayerInteraction (interactionName, layerId, callback) {
    if (interactionName === 'click') this._clickHandler.addLayerInteraction(layerId, callback)
    if (interactionName === 'mouseover') this._mouseoverHandler.addLayerInteraction(layerId, callback)
    if (interactionName === 'mouseout') this._mouseoutHandler.addLayerInteraction(layerId, callback)
  }

  removeAllLayerInteractions (layerId) {
    this._clickHandler.removeLayerInteraction(layerId)
    this._mouseoverHandler.removeLayerInteraction(layerId)
    this._mouseoutHandler.removeLayerInteraction(layerId)
  }

  // Add/remove mark interactions
  addMarkInteraction (interactionName, markId, callback) {
    if (interactionName === 'click') this._clickHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'mouseover') this._mouseoverHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'mouseout') this._mouseoutHandler.addMarkInteraction(markId, callback)
  }

  removeAllMarkInteractions (markId) {
    this._clickHandler.removeMarkInteraction(markId)
    this._mouseoverHandler.removeMarkInteraction(markId)
    this._mouseoutHandler.removeMarkInteraction(markId)
  }
}
