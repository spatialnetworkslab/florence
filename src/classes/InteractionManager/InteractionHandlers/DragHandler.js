import InteractionHandler from './InteractionHandler.js'

export default class DragHandler extends InteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._dragging = false
    this._draggingId = undefined
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

  _mousedownHandler (coordinates, mouseEvent) {
    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(coordinates)

    if (hits.length > 0) {
      this._dragging = true
      const firstHit = hits[0]
      this._draggingId = firstHit.markId
      const localCoords = this._getLocalCoordinates(coordinates)
      this._markCallbacks[this._draggingId].onDragStart(coordinates, localCoords, mouseEvent)
    }
  }

  _mousemoveHandler (coordinates, mouseEvent) {
    if (this._dragging) {
      const localCoords = this._getLocalCoordinates(coordinates)
      this._markCallbacks[this._draggingId].onDrag(coordinates, localCoords, mouseEvent)
    }
  }

  _mouseupHandler (coordinates, mouseEvent) {
    if (this._dragging) {
      const localCoords = this._getLocalCoordinates(coordinates)
      this._markCallbacks[this._draggingId].onDragEnd(coordinates, localCoords, mouseEvent)
      this._dragging = false
      this._draggingId = undefined
    }
  }

  _getLocalCoordinates (pixelCoords) {
    const section = this._interactionManager._section

    const scaleX = section.scales().scaleX
    const scaleY = section.scales().scaleY

    const clampedX = this._clamp(pixelCoords.x, section.x1(), section.x2())
    const clampedY = this._clamp(pixelCoords.y, section.y2(), section.y1())

    const localX = scaleX.invert(clampedX)
    const localY = scaleY.invert(clampedY)

    return { x: localX, y: localY }
  }

  _clamp (coord, min, max) {
    return Math.max(min, Math.min(coord, max))
  }
}
