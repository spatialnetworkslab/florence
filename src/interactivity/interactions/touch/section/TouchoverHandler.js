import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchoverHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchover',
      eventName: ['touchstart', 'touchmove']
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
        const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

        const touchoverEvent = createSectionEvent('touchover', {
          screenCoordinates,
          localCoordinates
        }, nativeEvent)

        this._callback(touchoverEvent)
        this._fingerCurrentlyOverSection = true
      }
    } else {
      if (this._fingerCurrentlyOverSection) {
        this._fingerCurrentlyOverSection = false
      }
    }
  }
}
