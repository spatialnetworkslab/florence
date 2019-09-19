import SectionInteractionHandler from '../../../_base/SectionInteractionHandler.js'

import createEvent from '../../../utils/createEvent.js'
import { getLocalCoordinates } from '../../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../../utils/hitUtils.js'

export default class MousedownHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mousedown',
      eventName: 'mousedown'
    })
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const interactionManager = this.interactionManager()
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

      const wheelEvent = createEvent('mousedown', {
        screenCoordinates,
        localCoordinates
      }, nativeEvent)

      this._callback(wheelEvent)
    }
  }
}
