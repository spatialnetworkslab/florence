import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'

export default class MouseupHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'touchend',
      eventName: ['touchend', 'touchcancel']
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const interactionManager = this.interactionManager()
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

      const touchendEvent = createSectionEvent('touchend', {
        screenCoordinates,
        localCoordinates
      }, nativeEvent)

      this._callback(touchendEvent)
    }
  }
}
