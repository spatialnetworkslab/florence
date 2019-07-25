import SectionInteractionHandler from './SectionInteractionHandler.js'

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._callback) {
      const mouseDownHandler = this._handleMouseDown.bind(this)
      const mouseMoveHandler = this._handleMouseMove.bind(this)
      const mouseUpHandler = this._handleMouseUp.bind(this)

      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-pan'

      eventManager.addEventListener('mousedown', listenerId + '-mousedown', mouseDownHandler)
      eventManager.addEventListener('mousemove', listenerId + '-mousemove', mouseMoveHandler)
      eventManager.addEventListener('mouseup', listenerId + '-mouseup', mouseUpHandler)

      this._panningActive = undefined
      this._panStartPosition = undefined
      this._panPreviousPosition = undefined
      this._panCurrentPosition = undefined
      this._panEndPosition = undefined
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const eventManager = this._interactionManager._eventManager
      const listenerId = this._interactionManager._id + '-pan'

      eventManager.removeEventListener('mousedown', listenerId + '-mousedown')
      eventManager.removeEventListener('mousemove', listenerId + '-mousemove')
      eventManager.removeEventListener('mouseup', listenerId + '-mouseup')
    }
  }

  _handleMouseDown (coordinates, mouseEvent) {
    this._panningActive = true
    this._panStartPosition = coordinates
    this._panCurrentPosition = coordinates
    this._startMouseEvent = mouseEvent
    // console.log('start', this._panningActive, this.panStartPosition)
  }

  _handleMouseMove (coordinates, mouseEvent) {
    if (this._panningActive) {
      this._panPreviousPosition = this._panCurrentPosition
      this._panCurrentPosition = coordinates
      // console.log('drag', this._panCurrentPosition, this.panStartPosition)
      // perform callback even during drag
      this._callStoredCallback(this._panPreviousPosition, this._panCurrentPosition)
    }
  }

  _handleMouseUp (coordinates, mouseEvent) {
    if (this._panningActive) {
      this._panningActive = false
      this._panEndCoordinates = this._panCurrentPosition
      this._endMouseEvent = mouseEvent
    }
  }

  _callStoredCallback (start, end) {
    const delta = { x: start.x - end.x, y: start.y - end.y }
    const event = { delta, startMouse: this._startMouseEvent, endMouse: this._endMouseEvent }

    this._callback(this._id, event)
    // compute delta
    // compute transformed delta
    // feed that as normalised value
    // start coordinates, end coordiantes, normDelta, original events (?)
  }
}
