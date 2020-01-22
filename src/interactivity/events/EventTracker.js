let handler

export default class EventTracker {
  constructor (eventManager, { eventName, nativeEventName, useWindow, preventDefault }) {
    this._eventManager = eventManager
    this._eventName = eventName
    this._nativeEventName = nativeEventName
    this._useWindow = useWindow
    this._preventDefault = preventDefault

    this._numberOfActiveListeners = 0
    this._callbacks = {}
  }

  setNativeEventName (nativeEventName) {
    this._nativeEventName = nativeEventName
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
      const nativeEventName = this._nativeEventName

      if (this._useWindow) {
        window.addEventListener(nativeEventName, handler)
      }

      if (!this._useWindow) {
        this._eventManager._domNode.addEventListener(nativeEventName, handler)
      }
    }

    this._numberOfActiveListeners++
  }

  _removeNativeListenerIfNecessary () {
    this._numberOfActiveListeners--

    if (this._numberOfActiveListeners === 0) {
      const nativeEventName = this._nativeEventName

      if (this._useWindow) {
        window.removeEventListener(nativeEventName, handler)
      }

      if (!this._useWindow) {
        this._eventManager._domNode.removeEventListener(nativeEventName, handler)
      }
    }
  }

  _handleEvent (nativeEvent) {
    if (this._preventDefault) nativeEvent.preventDefault()

    const screenCoordinates = this._getScreenCoordinates(nativeEvent)
    nativeEvent.eventName = this._eventName

    for (const listenerId in this._callbacks) {
      this._callbacks[listenerId](screenCoordinates, nativeEvent)
    }
  }

  _getScreenCoordinates (nativeEvent) {
    return this._eventManager._getScreenCoordinates(nativeEvent)
  }
}
