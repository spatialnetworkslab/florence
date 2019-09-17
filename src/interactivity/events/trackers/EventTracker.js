import { getNativeMouseEventName } from '../utils/getNativeEventName.js'

let handler

export default class MouseEventTracker {
  constructor (eventManager, eventName) {
    this._eventManager = eventManager
    this._eventName = eventName
    this._nativeEventName = getNativeMouseEventName(eventName)

    this._numberOfActiveListeners = 0
    this._callbacks = {}
  }

  addListener (listenerId, callback) {
    this._callbacks[listenerId] = callback

    if (this._eventManagerHasBeenMounted()) {
      this._attachNativeListenerIfNecessary()
    }
  }

  attachAllListeners () {
    /* eslint-disable-next-line */
    for (const _ in this._callbacks) {
      this._attachNativeListenerIfNecessary()
    }
  }

  removeListener (listenerId) {
    delete this._callbacks[listenerId]

    if (this._eventManagerHasBeenMounted()) {
      this._removeNativeListenerIfNecessary()
    }
  }

  _eventManagerHasBeenMounted () {
    return this._eventManager._mounted
  }

  _attachNativeListenerIfNecessary () {
    if (this._numberOfActiveListeners === 0) {
      handler = this._handleEvent.bind(this)
      const eventName = this._eventName
      const nativeEventName = this._nativeEventName

      if (eventName === 'mousemove') {
        window.addEventListener(nativeEventName, handler)
      }

      if (eventName !== 'mousemove') {
        this._eventManager._domNode.addEventListener(nativeEventName, handler)
      }
    }

    this._numberOfActiveListeners++
  }

  _removeNativeListenerIfNecessary () {
    this._numberOfActiveListeners--

    if (this._numberOfActiveListeners === 0) {
      const eventName = this._eventName
      const nativeEventName = this._nativeEventName

      if (eventName === 'mousemove') {
        window.removeEventListener(nativeEventName, handler)
      }

      if (eventName !== 'mousemove') {
        this._eventManager._domNode.removeEventListener(nativeEventName, handler)
      }
    }
  }

  _handleEvent (nativeEvent) {
    const screenCoordinates = this._getScreenCoordinates(nativeEvent)

    for (const listenerId in this._callbacks) {
      this._callbacks[listenerId](screenCoordinates, nativeEvent)
    }
  }

  _getScreenCoordinates (nativeEvent) {
    const svgPoint = this._eventManager._svgPoint
    const domNode = this._eventManager._domNode

    svgPoint.x = nativeEvent.clientX
    svgPoint.y = nativeEvent.clientY

    return svgPoint.matrixTransform(domNode.getScreenCTM().inverse())
  }
}
