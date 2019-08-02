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
    const section = this._interactionManager._sections

    const scaleX = section._scaleX
    const scaleY = section._scaleY

    const range =
    { minX: scaleX.invert(section._rangeX[0]),
      maxX: scaleX.invert(section._rangeX[1]),
      minY: scaleY.invert(section._rangeY[0]),
      maxY: scaleY.invert(section._rangeY[1]) }

    const localX = scaleX.invert(pixelCoords.x)
    const localY = scaleY.invert(pixelCoords.y)

    const clampedX = this._clamp(localX, range.minX, range.maxX)
    const clampedY = this._clamp(localY, range.minY, range.maxY)

    return { x: clampedX, y: clampedY }
  }

  _clamp (coord, min, max) {
    return Math.max(min, Math.min(coord, max))
  }
}
