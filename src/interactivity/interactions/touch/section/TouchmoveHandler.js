import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'
import numberOfTouches from '../../utils/numberOfTouches.js'

export default class TouchmoveHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchmove',
      eventName: 'touchmove'
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    if (numberOfTouches(screenCoordinates) !== 1) {
      return
    }

    const interactionManager = this.interactionManager()
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

      const touchmoveEvent = createSectionEvent('touchmove', {
        screenCoordinates,
        localCoordinates
      }, nativeEvent)

      this._callback(touchmoveEvent)
    }
  }
}
