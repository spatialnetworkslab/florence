import InteractionHandler from './InteractionHandler.js'
import { createZoomFunction } from '../../../components/Core/Section/ZoomContext'

export default class DragHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._draggingId = undefined
    this._hit = undefined
  }

  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id

      const mousedownHandler = this._mousedownHandler.bind(this)
      const mousemoveHandler = this._mousemoveHandler.bind(this)
      const mouseupHandler = this._mouseupHandler.bind(this)

      eventManager.addEventListener('mousedown', `${listenerId}-mousedown`, mousedownHandler)
      eventManager.addEventListener('mousemove', `${listenerId}-mousemove`, mousemoveHandler)
      eventManager.addEventListener('mouseup', `${listenerId}-mouseup`, mouseupHandler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id

      eventManager.removeEventListener('mousedown', `${listenerId}-mousedown`)
      eventManager.removeEventListener('mousemove', `${listenerId}-mousemove`)
      eventManager.removeEventListener('mouseup', `${listenerId}-mouseup`)
    }
  }

  /**
   * These handlers extend the MouseEvent with extra props which
   * we call a mouseDragEvent in the following functions:
   * - _handleHits()
   * - _executeCallback()
   *
   * The _mousedownHandler also queries for hits, which are used to
   * determine the layer/mark on which the drag event has been fired.
   *
   * @param {SVGPoint} coordinates - The SVGPoint object
   * @param {Object} mouseEvent - The original MouseEvent
   */
  _mousedownHandler (coordinates, mouseEvent) {
    mouseEvent.SVGPoint = coordinates
    mouseEvent.localCoords = this._getLocalCoordinates(coordinates)
    mouseEvent.dragType = 'onDragStart'

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(coordinates)

    if (hits.length > 0) {
      this._hit = hits[0]
      this._handleHits(mouseEvent)
    }
  }

  _mousemoveHandler (coordinates, mouseEvent) {
    mouseEvent.SVGPoint = coordinates
    mouseEvent.localCoords = this._getLocalCoordinates(coordinates)
    mouseEvent.dragType = 'onDrag'

    if (this._draggingId) {
      this._handleHits(mouseEvent)
    }
  }

  _mouseupHandler (coordinates, mouseEvent) {
    mouseEvent.SVGPoint = coordinates
    mouseEvent.localCoords = this._getLocalCoordinates(coordinates)
    mouseEvent.dragType = 'onDragEnd'

    if (this._draggingId) {
      this._handleHits(mouseEvent)
      this._draggingId = undefined
    }
  }

  _getLocalCoordinates (pixelCoords) {
    const im = this._interactionManager
    const section = im._section

    const coordinateTransformation = im._coordinateTransformation
      ? im._coordinateTransformation._transformation
      : undefined
    const zoom = im._zoom
      ? createZoomFunction(im._zoom)
      : undefined

    const scaleX = section.scales().scaleX
    const scaleY = section.scales().scaleY

    const clampedX = this._clamp(pixelCoords.x, section.x1, section.x2)
    const clampedY = this._clamp(pixelCoords.y, section.y1, section.y2)

    let localX = clampedX
    let localY = clampedY

    if (zoom) {
      [localX, localY] = zoom.invert([localX, localY])
    }

    if (coordinateTransformation) {
      [localX, localY] = coordinateTransformation.invert([localX, localY])
    }

    localX = scaleX.invert(localX)
    localY = scaleY.invert(localY)

    return { x: localX, y: localY }
  }

  _clamp (coord, min, max) {
    return Math.max(min, Math.min(coord, max))
  }

  /**
   * Checks whether a hit is in a layer or is a mark.
   * @param {Object} mouseDragEvent - The augmented MouseEvent passed to each handler
   */
  _handleHits (mouseDragEvent) {
    if (this._isInLayer(this._hit)) {
      mouseDragEvent.hitIndex = this._hit.$index
      this._executeCallback('layer', mouseDragEvent)
    }

    if (this._isMark(this._hit)) {
      this._executeCallback('mark', mouseDragEvent)
    }
  }

  /**
   * Executes the callback associated with a drag type.
   * @param {string} primitive - A layer or mark
   * @param {Object} mouseDragEvent - See _handleHits()
   */
  _executeCallback (primitive, mouseDragEvent) {
    if (mouseDragEvent.dragType === 'onDragStart') {
      this._draggingId = this._hit[`${primitive}Id`]
    }

    this[`_${primitive}Callbacks`][this._draggingId][mouseDragEvent.dragType](mouseDragEvent)
  }
}
