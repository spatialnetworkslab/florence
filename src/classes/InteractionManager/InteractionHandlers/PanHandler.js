import SectionInteractionHandler from './SectionInteractionHandler.js'
import createEvent from './utils/createEvent.js'

export default class PanHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager)

    this._panningActive = undefined
    this._panPreviousPosition = undefined
    this._panCurrentPosition = undefined
    this._startEvent = undefined
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

  _nopropagation (nativeEvent) {
    nativeEvent.preventDefault() // Cancel the event from affecting the whole window
  }

  // Record initial mousedown, touchstart
  _handleStart (screenCoordinates, nativeEvent) {
    this._nopropagation(nativeEvent)
    this._panningActive = true
    this._panCurrentPosition = screenCoordinates

    const startEvent = this._createEvent(screenCoordinates, screenCoordinates, nativeEvent)
    this._startEvent = startEvent
  }

  // For smooth dragging, perform callback even during drag
  // To bound dragging to only the section, check cursor location and if still in section
  _handleMove (screenCoordinates, nativeEvent) {
    if (this._panningActive && this._isInSection(screenCoordinates)) {
      this._panPreviousPosition = this._panCurrentPosition
      this._panCurrentPosition = screenCoordinates
      this._callStoredCallback(screenCoordinates, this._panPreviousPosition, nativeEvent)
    } else {
      this._handleEnd(screenCoordinates, nativeEvent)
    }
  }

  // Record eventup events (when cursor leaves area of mark/layer/screen)
  _handleEnd (screenCoordinates, nativeEvent) {
    if (this._panningActive) {
      this._panningActive = false
      this._panPreviousPosition = undefined
      this._panCurrentPosition = undefined
      this._startEvent = undefined
    }
  }

  _callStoredCallback (screenCoordinates, previousScreenCoordinates, nativeEvent) {
    const panEvent = this._createEvent(
      screenCoordinates, previousScreenCoordinates, nativeEvent, this._startEvent
    )
    this._callback(panEvent)
  }

  _createEvent (screenCoordinates, previousScreenCoordinates, nativeEvent, startEvent) {
    const delta = {
      x: previousScreenCoordinates.x - screenCoordinates.x,
      y: previousScreenCoordinates.y - screenCoordinates.y
    }

    const localCoordinates = this._getLocalCoordinates(screenCoordinates)
    const panEvent = createEvent('pan', {
      screenCoordinates,
      localCoordinates,
      delta
    }, nativeEvent)

    if (startEvent) panEvent.startEvent = startEvent

    return panEvent
  }
}
