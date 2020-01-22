import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchoutHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchout',
      eventName: ['touchstart', 'touchmove', 'touchend']
    })

    this._fingerCurrentlyOverSection = false
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (numberOfTouches(screenCoordinates) !== 1) {
      return
    }

    if (nativeEvent.eventName === 'touchstart') {
      this._handleTouchstart(screenCoordinates, nativeEvent)
    }

    if (nativeEvent.eventName === 'touchmove') {
      this._handleTouchmove(screenCoordinates, nativeEvent)
    }

    if (nativeEvent.eventName === 'touchend') {
      this._handleTouchend()
    }
  }

  _handleTouchstart (screenCoordinates, nativeEvent) {
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      this._fingerCurrentlyOverSection = true
    }
  }

  _handleTouchmove (screenCoordinates, nativeEvent) {
    const interactionManager = this.interactionManager()
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      if (!this._fingerCurrentlyOverSection) {
        this._fingerCurrentlyOverSection = true
      }
    } else {
      if (this._fingerCurrentlyOverSection) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

        const touchoutEvent = createSectionEvent('touchout', {
          screenCoordinates,
          localCoordinates
        }, nativeEvent)

        this._callback(touchoutEvent)
        this._fingerCurrentlyOverSection = false
      }
    }
  }

  _handleTouchend () {
    this._fingerCurrentlyOverSection = false
  }
}
