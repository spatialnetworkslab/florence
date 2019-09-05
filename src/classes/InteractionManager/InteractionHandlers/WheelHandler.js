import SectionInteractionHandler from './SectionInteractionHandler.js'
import getScrollLineHeight from './utils/getScrollLineHeight.js'

let scrollLineHeight

export default class WheelHandler extends SectionInteractionHandler {
  _addEventListener () {
    const eventManager = this._interactionManager._eventManager
    const listenerId = this._interactionManager._id + '-wheel'

    if (eventManager._detectIt.deviceType.includes('mouse')) {
      const handler = this._handleEvent.bind(this)
      eventManager.addEventListener('wheel', listenerId, handler)
    } 

    if (eventManager._detectIt.deviceType.includes('touch')) {
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
      const listenerId = this._interactionManager._id + '-wheel'
      // Mouse
      if (eventManager._detectIt.deviceType.includes('mouse')) {
        eventManager.removeEventListener('wheel', listenerId)
      }

      if (eventManager._detectIt.deviceType.includes('touch')) {
        eventManager.removeEventListener('wheel' + '-start-pinch', listenerId)
        eventManager.removeEventListener('wheel' + '-move-pinch', listenerId)
        eventManager.removeEventListener('wheel' + '-end-pinch', listenerId)
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

  _nopropagation (event) {
    event.preventDefault() // Cancel the event
    event.stopPropagation() // Don't bubble
  }

  _handleEvent (coordinates, event) {
    this._nopropagation(event)

    const wheelDelta = this._defaultWheelDelta(event)
    const evt = { wheelDelta, coordinates: coordinates, originalEvent: event }

    if (this._isInSection(coordinates)) {
      this._callback(evt)
    }
  }

  _handleEventStart (coordinates, event) {
    //console.log(event.type, coordinates) // need to get two fingers then do math from there
    this._nopropagation(event)

    const wheelDelta = this._defaultWheelDelta(event)
    const evt = { wheelDelta, coordinates: coordinates, originalEvent: event }
    const sectionBbox = this._interactionManager._section

    if (this._isInSection(coordinates, sectionBbox)) {
      this._callback(evt)
    }
  }

  _handleEventMove (coordinates, event) {
    //console.log(event.type, coordinates)
    const wheelDelta = this._defaultWheelDelta(event)
    const evt = { wheelDelta, coordinates: coordinates, originalEvent: event }
    const sectionBbox = this._interactionManager._section

    if (this._isInSection(coordinates, sectionBbox)) {
      this._callback(evt)
    }
  }

  _handleEventEnd (coordinates, event) {
    //console.log(event.type, coordinates)
    const wheelDelta = this._defaultWheelDelta(event)
    const evt = { wheelDelta, coordinates: coordinates, originalEvent: event }
    const sectionBbox = this._interactionManager._section

    if (this._isInSection(coordinates, sectionBbox)) {
      this._callback(evt)
    }
  }
}
