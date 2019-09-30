import InteractionHandler from './InteractionHandler.js'
import createEvent from './utils/createEvent.js'

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

      eventManager.addEventListener('eventdown', `${listenerId}-eventdown`, mousedownHandler)
      eventManager.addEventListener('eventmove', `${listenerId}-eventmove`, mousemoveHandler)
      eventManager.addEventListener('eventup', `${listenerId}-eventup`, mouseupHandler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id

      eventManager.removeEventListener('eventdown', `${listenerId}-eventdown`)
      eventManager.removeEventListener('eventmove', `${listenerId}-eventmove`)
      eventManager.removeEventListener('eventup', `${listenerId}-eventup`)
    }
  }

  _nopropagation (event) {
    event.preventDefault() // Cancel the event from affecting the whole window
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
  _mousedownHandler (screenCoordinates, nativeEvent) {
    this._nopropagation(nativeEvent)

    const localCoordinates = this._getLocalCoordinates(screenCoordinates)
    const dragEvent = createEvent('dragstart', {
      screenCoordinates,
      localCoordinates
    }, nativeEvent)

    const spatialIndex = this._spatialIndex
    const hits = spatialIndex.queryMouseCoordinates(screenCoordinates)

    if (hits.length > 0) {
      this._hit = hits[0]
      this._handleHits(dragEvent)
    }
  }

  _mousemoveHandler (screenCoordinates, nativeEvent) {
    const localCoordinates = this._getLocalCoordinates(screenCoordinates)
    const dragEvent = createEvent('drag', {
      screenCoordinates,
      localCoordinates
    }, nativeEvent)

    if (this._draggingId) {
      this._handleHits(dragEvent)
    }
  }

  _mouseupHandler (screenCoordinates, nativeEvent) {
    const localCoordinates = this._getLocalCoordinates(screenCoordinates)
    const dragEvent = createEvent('dragend', {
      screenCoordinates,
      localCoordinates
    }, nativeEvent)

    if (this._draggingId) {
      this._handleHits(dragEvent)
      this._draggingId = undefined
    }
  }

  /**
   * Checks whether a hit is in a layer or is a mark.
   * @param {Object} dragEvent - The dragEvent passed to each handler
   */
  _handleHits (dragEvent) {
    if (this._isInLayer(this._hit)) {
      dragEvent.key = this._hit.key
      dragEvent.index = this._hit.index
      this._executeCallback('layer', dragEvent)
    }

    if (this._isMark(this._hit)) {
      this._executeCallback('mark', dragEvent)
    }
  }

  /**
   * Executes the callback associated with a drag type.
   * @param {string} primitive - A layer or mark
   * @param {Object} dragEvent - See _handleHits()
   */
  _executeCallback (primitive, dragEvent) {
    if (dragEvent.type === 'dragstart') {
      this._draggingId = this._hit[`${primitive}Id`]
    }

    const callback = this[`_${primitive}Callbacks`][this._draggingId][dragCallbackMap[dragEvent.type]]

    if (callback) {
      callback(dragEvent)
    }
  }
}

const dragCallbackMap = { dragstart: 'onDragstart', drag: 'onDrag', dragend: 'onDragend' }
