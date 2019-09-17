import SectionInteractionHandler from './SectionInteractionHandler.js'
import getScrollLineHeight from './utils/getScrollLineHeight.js'

let scrollLineHeight

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListener () {
    const eventManager = this._interactionManager._eventManager

    if (eventManager._detectIt.deviceType.includes('mouse')) {
      const listenerId = this._interactionManager._id + '-wheel'
      const handler = this._handleEvent.bind(this)
      eventManager.addEventListener('wheel', listenerId, handler)
    }

    if (eventManager._detectIt.deviceType.includes('touch')) {
      this._prevDelta = undefined
      this._prevCenter = undefined
      const listenerId = this._interactionManager._id + '-touch'
      const startHandler = this._handleEventStart.bind(this)
      const moveHandler = this._handleEventMove.bind(this)
      const endHandler = this._handleEventEnd.bind(this)
      eventManager.addEventListener('eventdown', listenerId + '-start-pinch', startHandler)
      eventManager.addEventListener('eventmove', listenerId + '-move-pinch', moveHandler)
      eventManager.addEventListener('eventup', listenerId + '-end-pinch', endHandler)
    }
  }

  _removeEventListener () {
    if (this._callback) {
      const eventManager = this._interactionManager._eventManager

      // Mouse
      if (eventManager._detectIt.deviceType.includes('mouse')) {
        const listenerId = this._interactionManager._id + '-wheel'
        eventManager.removeEventListener('wheel', listenerId)
      }

      if (eventManager._detectIt.deviceType.includes('touch')) {
        const listenerId = this._interactionManager._id + '-touch'
        eventManager.removeEventListener('eventdown', listenerId + '-start-pinch')
        eventManager.removeEventListener('eventmove', listenerId + '-move-pinch')
        eventManager.removeEventListener('eventup', listenerId + '-end-pinch')
      }
    }
  }

  // normalised for most browsers, trackpads and mouses
  // based on openstreemtmaps: https://github.com/openstreetmap/iD/blob/f61c482188b1b747fdf528ac2992f6ed9e8a2b6a/modules/renderer/map.js#L376-L396
  // and normalize-wheel: https://github.com/basilfx/normalize-wheel/blob/master/src/normalizeWheel.js
  // Enables normal scrolling motion + legacy delta tracking
  _defaultWheelDelta (event) {
    let delta

    // Legacy
    // IE pixels
    if ('wheelDelta' in event && event.wheelDelta !== 0) {
      delta = -event.wheelDelta
    }

    // Mozilla
    if ('detail' in event && event.detail !== 0) {
      delta = -event.detail
    }

    // Most other cases
    if ('deltaY' in event && event.deltaY !== 0) {
      delta = -event.deltaY
    }

    if (!scrollLineHeight) {
      scrollLineHeight = getScrollLineHeight()
    }

    return delta * (event.deltaMode ? scrollLineHeight : 1) / 500
  }

  /*
  Based on approach from hammer.js:
  https://github.com/hammerjs/hammer.js/blob/master/src/inputjs/get-scale.js

  Resulting delta must be close to 1 or -1
  */
  _touchProps (events) {
    const sectionBBox = this._interactionManager._section
    const sectionHeight = sectionBBox.maxY - sectionBBox.minY
    const ev1 = events[0]
    const ev2 = events[1]
    let delta = -Math.sqrt((ev2.x - ev1.x) ** 2 + (ev2.y - ev1.y) ** 2) / (sectionHeight * 40)
    
    if (this._prevDelta) {
      if (this._prevDelta > Math.abs(delta)) {
        delta = -delta
      }
      this._prevDelta = Math.abs(delta)
    }

    const center = { x: (ev2.x + ev1.x) / 2, y: (ev2.y + ev1.y) / 2 }
    return { delta, center }
  }

  _nopropagation (event) {
    event.preventDefault() // Cancel the event to prevent the whole page from scrolling
    event.stopPropagation() // Don't bubble
  }

  _handleEvent (coordinates, event) {
    this._nopropagation(event)
    const delta = this._defaultWheelDelta(event)
    const evt = { delta, coordinates: coordinates, originalEvent: event, type: 'mouse' }

    if (this._isInSection(coordinates)) {
      this._callback(evt)
    }
  }

  // stores first reference coordinates for zooming
  _handleEventStart (coordinates, event) {
    if (coordinates.constructor === Array) {
      this._nopropagation(event)

      const touchProps = this._touchProps(coordinates)
      this._prevDelta = touchProps.delta
      this._prevCenter = touchProps.center
    }
  }

  // Computes delta
  // Triggers callback
  _handleEventMove (coordinates, event) {
    if (coordinates.constructor === Array) {
      this._nopropagation(event)

      const touchProps = this._touchProps(coordinates)
      const evt = { delta: touchProps.delta, center: touchProps.center, coordinates: coordinates, originalEvent: event, type: 'touch' }

      if (this._isInSection(coordinates[0]) && this._isInSection(coordinates[1]) && this._isInSection(evt.center)) {
        this._callback(evt)
      }
    }
  }

  // Clean up
  _handleEventEnd (coordinates, event) {
    if (coordinates.constructor === Array) {
      this._nopropagation(event)

      const touchProps = this._touchProps(coordinates)
      const evt = { delta: touchProps.delta, center: touchProps.center, coordinates: coordinates, originalEvent: event, type: 'touch' }

      if (this._isInSection(coordinates[0]) && this._isInSection(coordinates[1]) && this._isInSection(evt.center)) {
        this._callback(evt)
      }
    }
  }
}
