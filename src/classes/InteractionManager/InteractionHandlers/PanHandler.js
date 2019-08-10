import SectionInteractionHandler from './SectionInteractionHandler.js'
// repetitive, merge certain function handlers together
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
    const eventManager = this._interactionManager._eventManager
    const listenerId = this._interactionManager._id + '-pan'

    if (!eventManager._isMobile) {
      const mouseDownHandler = this._handleStart.bind(this)
      const mouseMoveHandler = this._handleMove.bind(this)
      const mouseUpHandler = this._handleEnd.bind(this)

      eventManager.addEventListener('mousedown', listenerId + '-mousedown', mouseDownHandler)
      eventManager.addEventListener('mousemove', listenerId + '-mousemove', mouseMoveHandler)
      eventManager.addEventListener('mouseup', listenerId + '-mouseup', mouseUpHandler)
    } else {
      const touchStartHandler = this._handleStart.bind(this)
      const touchMoveHandler = this._handleMove.bind(this)
      const touchEndHandler = this._handleEnd.bind(this)

      // In case touch gets interrupted
      // Prescribed for cleanup
      const touchCancelHandler = this._handleEnd.bind(this)

      eventManager.addEventListener('touchstart', listenerId + '-touchstart', touchStartHandler)
      eventManager.addEventListener('touchmove', listenerId + '-touchmove', touchMoveHandler)
      eventManager.addEventListener('touchend', listenerId + '-touchend', touchEndHandler)
      eventManager.addEventListener('touchcancel', listenerId + '-touchcancel', touchCancelHandler)
    }
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

  _nopropagation (event) {
    event.preventDefault() // Cancel the event from affecting the whole window
  }

  // Record initial mousedown, touchstart
  _handleStart (coordinates, event) {
    this._nopropagation(event)
    this._panningActive = true
    this._panStartPosition = coordinates
    this._panCurrentPosition = coordinates
    this._startEvent = event
  }

  // For smooth dragging, perform callback even during drag
  // To bound dragging to only the section, check cursor location and if still in section
  _handleMove (coordinates, event) {
    const sectionBbox = this._interactionManager._section
    if (this._panningActive && this._isInSection(coordinates, sectionBbox)) {
      this._panPreviousPosition = this._panCurrentPosition
      this._panCurrentPosition = coordinates
      this._callStoredCallback(coordinates, event, this._panPreviousPosition, this._panCurrentPosition)
    } else {
      this._handleEnd(coordinates, event)
    }
  }

  // Record mouseup, touchend
  _handleEnd (coordinates, event) {
    if (this._panningActive) {
      this._panningActive = false
      this._panEndCoordinates = this._panCurrentPosition
      this._endEvent = event
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
