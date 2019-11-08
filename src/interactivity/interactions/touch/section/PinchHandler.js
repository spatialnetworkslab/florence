import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class PinchHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'pinch',
      eventName: 'touchmove'
    })
  }

  _handleEvent (nativeEvent) {
    if (numberOfTouches(nativeEvent) !== 2) {
      return
    }

    const interactionManager = this.interactionManager()
    const section = this.section()

    for (let i = 0; i < 2; i++) {
      const touch = nativeEvent.touches[i]
    }

    // for ()

    // if (coordinatesAreInsideSection(screenCoordinates, section)) {
    //   for (let i = 0; i < 2; i++) {
    //     const touchPoint = nativeEvent.
    //     const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

    //     const pinchEvent = createSectionEvent('pinch', {
    //       screenCoordinates,
    //       localCoordinates
    //     }, nativeEvent)

    //     this._callback(pinchEvent)
    //   }
    // }
  }
}