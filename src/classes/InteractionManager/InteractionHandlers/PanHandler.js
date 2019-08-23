import SectionInteractionHandler from './SectionInteractionHandler.js'

export default class PanHandler extends SectionInteractionHandler {
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

    const eventDownHandler = this._handleStart.bind(this)
    const eventMoveHandler = this._handleMove.bind(this)
    const eventUpHandler = this._handleEnd.bind(this)

    eventManager.addEventListener('eventdown', listenerId + '-eventdown', eventDownHandler)
    eventManager.addEventListener('eventmove', listenerId + '-eventmove', eventMoveHandler)
    eventManager.addEventListener('eventup', listenerId + '-eventup', eventUpHandler)
    
  }

  _removeEventListener () {
    if (this._callback) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-pan'

      eventManager.removeEventListener('eventdown', listenerId + '-eventdown')
      eventManager.removeEventListener('eventmove', listenerId + '-eventmove')
      eventManager.removeEventListener('eventup', listenerId + '-eventup')
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

  // Record eventup events (when cursor leaves area of mark/layer/screen)
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
