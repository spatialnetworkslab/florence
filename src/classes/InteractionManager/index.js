import ClickHandler from './InteractionHandlers/ClickHandler.js'
import HoverHandler from './InteractionHandlers/HoverHandler.js'
import MouseoutHandler from './InteractionHandlers/MouseoutHandler.js'
import WheelHandler from './InteractionHandlers/WheelHandler.js'
import PanHandler from './InteractionHandlers/PanHandler.js'
import DragHandler from './InteractionHandlers/DragHandler.js'
import { markIndexing, layerIndexing } from './indexingFunctions'

export default class InteractionManager {
  constructor () {
    this._section = undefined
    this._coordinateTransformation = undefined
    this._zoom = undefined

    this._layers = {}
    this._marks = {}

    this._id = undefined
    this._eventManager = undefined

    this._clickHandler = new ClickHandler(this)
    this._hoverHandler = new HoverHandler(this)
    this._mouseoutHandler = new MouseoutHandler(this)
    this._wheelHandler = new WheelHandler(this)
    this._panHandler = new PanHandler(this)
    this._dragHandler = new DragHandler(this)
  }

  // Initialization
  setId (id) {
    this._id = id
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }

  // Section loading and removing
  loadSection (sectionData) {
    this._section = sectionData
  }

  loadCoordinateTransformation (coordinateTransformation) {
    this._coordinateTransformation = coordinateTransformation
  }

  loadZoom (zoom) {
    this._zoom = zoom
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
    if (interactionName === 'drag') this._dragHandler.addLayerInteraction(layerId, callback)
  }

  removeAllLayerInteractions (layerId) {
    this._clickHandler.removeLayerInteraction(layerId)
    this._hoverHandler.removeLayerInteraction(layerId)
    this._mouseoutHandler.removeLayerInteraction(layerId)
    this._dragHandler.removeLayerInteraction(layerId)
  }

  // Add/remove mark interactions
  addMarkInteraction (interactionName, markId, callback) {
    if (interactionName === 'click') this._clickHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'hover') this._hoverHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'mouseout') this._mouseoutHandler.addMarkInteraction(markId, callback)
    if (interactionName === 'drag') this._dragHandler.addMarkInteraction(markId, callback)
  }

  removeAllMarkInteractions (markId) {
    this._clickHandler.removeMarkInteraction(markId)
    this._hoverHandler.removeMarkInteraction(markId)
    this._mouseoutHandler.removeMarkInteraction(markId)
    this._dragHandler.removeMarkInteraction(markId)
  }
}
