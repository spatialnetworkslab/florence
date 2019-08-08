import SectionInteractionHandler from './SectionInteractionHandler.js'

export default class WheelHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._panningActive = undefined
    this._panStartPosition = undefined
    this._panPreviousPosition = undefined
    this._panCurrentPosition = undefined
    this._panEndPosition = undefined
  }

  // Normalised for desktop: mousedown, mousemove, mouseup
  // Mobile: touchstart, touchmove, touchend
  _addEventListener () {
    const mouseDownHandler = this._handleMouseDown.bind(this)
    const mouseMoveHandler = this._handleMouseMove.bind(this)
    const mouseUpHandler = this._handleMouseUp.bind(this)

    const eventManager = this._interactionManager._eventManager
    const listenerId = this._interactionManager._id + '-pan'

    eventManager.addEventListener('mousedown', listenerId + '-mousedown', mouseDownHandler)
    eventManager.addEventListener('mousemove', listenerId + '-mousemove', mouseMoveHandler)
    eventManager.addEventListener('mouseup', listenerId + '-mouseup', mouseUpHandler)

    const touchStartHandler = this._handleTouchStart.bind(this)
    const touchMoveHandler = this._handleTouchMove.bind(this)
    const touchEndHandler = this._handleTouchEnd.bind(this)

    // not sure if necessary?
    // In case touch gets interrupted
    // Prescribed for cleanup
    const touchCancelHandler = this._handleTouchEnd.bind(this)

    eventManager.addEventListener('touchstart', listenerId + '-touchstart', touchStartHandler)
    eventManager.addEventListener('touchmove', listenerId + '-touchmove', touchMoveHandler)
    eventManager.addEventListener('touchend', listenerId + '-touchend', touchEndHandler)
    eventManager.addEventListener('touchcancel', listenerId + '-touchcancel', touchCancelHandler)
  }

  _removeEventListener () {
    if (this._callback) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-pan'

      eventManager.removeEventListener('mousedown', listenerId + '-mousedown')
      eventManager.removeEventListener('mousemove', listenerId + '-mousemove')
      eventManager.removeEventListener('mouseup', listenerId + '-mouseup')

      eventManager.removeEventListener('touchstart', listenerId + '-touchstart')
      eventManager.removeEventListener('touchmove', listenerId + '-touchmove')
      eventManager.removeEventListener('touchend', listenerId + '-touchend')
      eventManager.removeEventListener('touchcancel', listenerId + '-touchcancel')
    }
  }

  // Record initial mousedown
  _handleMouseDown (coordinates, mouseEvent) {
    this._panningActive = true
    this._panStartPosition = coordinates
    this._panCurrentPosition = coordinates
    this._startEvent = mouseEvent
  }

  // For smooth dragging, perform callback even during drag
  // To bound dragging to only the section, check cursor location and if still in section
  _handleMouseMove (coordinates, mouseEvent) {
    const sectionBbox = this._interactionManager._section
    if (this._panningActive && this._isInSection(coordinates, sectionBbox)) {
      this._panPreviousPosition = this._panCurrentPosition
      this._panCurrentPosition = coordinates
      this._callStoredCallback(coordinates, mouseEvent, this._panPreviousPosition, this._panCurrentPosition)
    } else {
      this._handleMouseUp(coordinates, mouseEvent)
    }
  }

  // Record mouseup
  _handleMouseUp (coordinates, mouseEvent) {
    if (this._panningActive) {
      this._panningActive = false
      this._panEndCoordinates = this._panCurrentPosition
      this._endEvent = mouseEvent
    }
  }


  // Record initial touchstart
  _handleTouchStart (coordinates, touchEvent) {
    this._panningActive = true
    this._panStartPosition = coordinates
    this._panCurrentPosition = coordinates
    this._startEvent = touchEvent
  }

  // For smooth panning, perform callback even during drag
  // To bound panning to only the section
  // check cursor location and if it is still in section
  _handleTouchMove (coordinates, touchEvent) {
    const sectionBbox = this._interactionManager._section
    
    if (this._panningActive && this._isInSection(coordinates, sectionBbox)) {
      this._panPreviousPosition = this._panCurrentPosition
      this._panCurrentPosition = coordinates
      this._callStoredCallback(coordinates, touchEvent, this._panPreviousPosition, this._panCurrentPosition)
    } else {
      this._handleTouchEnd(coordinates, touchEvent)
    }
  }

  // Record touchend
  _handleTouchEnd (coordinates, touchEvent) {
    if (this._panningActive) {
      this._panningActive = false
      this._panEndCoordinates = this._panCurrentPosition
      this._endEvent = touchEvent
    }
  }

  _callStoredCallback (coordinates, evt, start, end) {
    const delta = { x: start.x - end.x, y: start.y - end.y }
    const event = {
      delta,
      x: coordinates.x,
      y: coordinates.y,
      originalMouseEvent: evt,
      startEvent: this._startEvent,
      endEvent: this._endEvent
    }

    this._callback(event)
  }
}
