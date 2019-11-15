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

    this._previousDelta = undefined
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
      const sectionHeight = section.maxY - section.minY
      this._previousDelta = getDelta(screenCoordinatesArray, sectionHeight)
    }
  }

  _handleTouchmove (screenCoordinatesArray, nativeEvent) {
    if (numberOfTouches(screenCoordinatesArray) !== 2) {
      return
    }

    if (!this._previousDelta) return

    const section = this.section()

    if (allCoordinatesAreInsideSection(screenCoordinatesArray, section)) {
      const sectionHeight = section.maxY - section.minY

      const center = getCenter(screenCoordinatesArray)

      let delta = getDelta(screenCoordinatesArray, sectionHeight)
      const absoluteDelta = Math.abs(delta)

      if (this._previousDelta > absoluteDelta) {
        delta = -delta
      }

      this._fireCallback(screenCoordinatesArray, nativeEvent, delta, center)

      this._previousDelta = absoluteDelta
    }
  }

  _handleTouchend (screenCoordinatesArray, nativeEvent) {
    this._previousDelta = undefined
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

function getDelta (screenCoordinatesArray, sectionHeight) {
  const [coords1, coords2] = screenCoordinatesArray
  return -Math.sqrt((coords2.x - coords1.x) ** 2 + (coords2.y - coords1.y) ** 2) / (sectionHeight * 50)
}

function getCenter (screenCoordinatesArray) {
  const [coords1, coords2] = screenCoordinatesArray
  return { x: (coords2.x + coords1.x) / 2, y: (coords2.y + coords1.y) / 2 }
}
