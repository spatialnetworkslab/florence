import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class PinchHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'pinch',
      eventName: ['touchstart', 'touchmove', 'touchend']
    })

    this._previousTouchDistance = undefined
  }

  _handleEvent (screenCoordinatesArray, nativeEvent) {
    if (nativeEvent.type === 'touchstart') {
      this._handleTouchstart(screenCoordinatesArray, nativeEvent)
    }

    if (nativeEvent.type === 'touchmove') {
      this._handleTouchmove(screenCoordinatesArray, nativeEvent)
    }

    if (nativeEvent.type === 'touchend') {
      this._handleTouchend(screenCoordinatesArray, nativeEvent)
    }
  }

  _handleTouchstart (screenCoordinatesArray, nativeEvent) {
    if (numberOfTouches(screenCoordinatesArray) !== 2) {
      return
    }

    const section = this.section()

    if (allCoordinatesAreInsideSection(screenCoordinatesArray, section)) {
      this._previousTouchDistance = getDistance(screenCoordinatesArray)
    }
  }

  _handleTouchmove (screenCoordinatesArray, nativeEvent) {
    if (numberOfTouches(screenCoordinatesArray) !== 2) {
      return
    }

    if (this._previousTouchDistance === undefined) return

    const section = this.section()

    if (allCoordinatesAreInsideSection(screenCoordinatesArray, section)) {
      const sectionHeight = section.maxY - section.minY

      const center = getCenter(screenCoordinatesArray)

      const touchDistance = getDistance(screenCoordinatesArray)
      const touchDelta = this._previousTouchDistance - touchDistance
      const relativeTouchDelta = touchDelta / sectionHeight

      this._previousTouchDistance = touchDistance
      this._fireCallback(screenCoordinatesArray, nativeEvent, relativeTouchDelta, center)
    }
  }

  _handleTouchend (screenCoordinatesArray, nativeEvent) {
    this._previousTouchDistance = undefined
  }

  _fireCallback (screenCoordinatesArray, nativeEvent, delta, center) {
    const screenCenter = center
    const localCenter = getLocalCoordinates(screenCenter, this.interactionManager())
    const screenCoordinates = screenCoordinatesArray
    const localCoordinates = screenCoordinatesArray.map(screenCoordinates => {
      return getLocalCoordinates(screenCoordinates, this.interactionManager())
    })

    const pinchEvent = createSectionEvent('pinch', {
      screenCenter,
      localCenter,
      screenCoordinates,
      localCoordinates,
      delta
    }, nativeEvent)

    this._callback(pinchEvent)
  }
}

function allCoordinatesAreInsideSection (screenCoordinatesArray, section) {
  return screenCoordinatesArray.every(screenCoordinates => {
    return coordinatesAreInsideSection(screenCoordinates, section)
  })
}

function getDistance (screenCoordinatesArray) {
  const [coords1, coords2] = screenCoordinatesArray
  return Math.sqrt((coords2.x - coords1.x) ** 2 + (coords2.y - coords1.y) ** 2)
}

function getCenter (screenCoordinatesArray) {
  const [coords1, coords2] = screenCoordinatesArray
  return { x: (coords2.x + coords1.x) / 2, y: (coords2.y + coords1.y) / 2 }
}
