import ClickHandler from './InteractionHandlers/ClickHandler.js'
import HoverHandler from './InteractionHandlers/HoverHandler.js'
import MouseoutHandler from './InteractionHandlers/MouseoutHandler.js'
import WheelHandler from './InteractionHandlers/WheelHandler.js'
import PanHandler from './InteractionHandlers/PanHandler.js'
import { markIndexing, layerIndexing } from './indexingFunctions'

export default class InteractionManager {
  constructor () {
    this._section = undefined
    this._layers = {}
    this._marks = {}

    this._id = undefined
    this._eventManager = undefined

    this._clickHandler = new ClickHandler(this)
    this._hoverHandler = new HoverHandler(this)
    this._mouseoutHandler = new MouseoutHandler(this)
    this._wheelHandler = new WheelHandler(this)
    this._panHandler = new PanHandler(this)
  }

  // Initialization
  setId (id) {
    this._id = id
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }

  // Section loading and removing
  loadSection (_sectionData) {
    const sectionData = removeUnderscores(_sectionData)
    const sectionCoordinates = getSectionCoordinates(sectionData)
    this._section = Object.assign(sectionData, sectionCoordinates)
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
  addSectionInteraction (interactionName, callback) {
    if (interactionName === 'wheel') this._wheelHandler.addSectionInteraction(callback)
    if (interactionName === 'pan') this._panHandler.addSectionInteraction(callback)
  }

  removeAllSectionInteractions () {
    this._wheelHandler.removeSectionInteraction()
    this._panHandler.removeSectionInteraction()
  }

  // Add/remove layer interactions
  addLayerInteraction (interactionName, layerId, callback) {
    if (interactionName === 'click') this._clickHandler.addLayerInteraction(layerId, callback)
    if (interactionName === 'hover') this._hoverHandler.addLayerInteraction(layerId, callback)
    if (interactionName === 'mouseout') this._mouseoutHandler.addLayerInteraction(layerId, callback)
  }

  removeAllLayerInteractions (layerId) {
    this._clickHandler.removeLayerInteraction(layerId)
    this._hoverHandler.removeLayerInteraction(layerId)
    this._mouseoutHandler.removeLayerInteraction(layerId)
  }

  // Add/remove mark interactions
  addMarkInteraction (interactionName, markId, callback) {
    if (interactionName === 'click') this._clickHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'hover') this._hoverHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'mouseout') this._mouseoutHandler.addMarkInteraction(markId, callback)
  }

  removeAllMarkInteractions (markId) {
    this._clickHandler.removeMarkInteraction(markId)
    this._hoverHandler.removeMarkInteraction(markId)
    this._mouseoutHandler.removeMarkInteraction(markId)
  }
}

function removeUnderscores (_sectionData) {
  const sectionData = {}

  for (const key in _sectionData) {
    sectionData[key.substring(1)] = _sectionData[key]
  }

  return sectionData
}

function getSectionCoordinates (sectionData) {
  return {
    x1: sectionData.rangeX[0],
    x2: sectionData.rangeX[1],
    y1: sectionData.rangeY[0],
    y2: sectionData.rangeY[1]
  }
}
