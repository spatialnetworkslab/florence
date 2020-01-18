import SectionInteractionHandler from '../../base/handlers/SectionInteractionHandler.js'

import { createSectionEvent } from '../../utils/createEvent.js'
import { getLocalCoordinates } from '../../utils/getLocalCoordinates.js'
import { coordinatesAreInsideSection } from '../../utils/hitUtils.js'

export default class MouseoverHandler extends SectionInteractionHandler {
  constructor (interactionManager) {
    super(interactionManager, {
      interactionName: 'mouseover',
      eventName: 'mousemove'
    })

    this._mouseCurrentlyOverSection = false
  }

  _handleEvent (screenCoordinates, nativeEvent) {
    const interactionManager = this.interactionManager()
    const section = this.section()

    if (coordinatesAreInsideSection(screenCoordinates, section)) {
      if (!this._mouseCurrentlyOverSection) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager)

        const mousedownEvent = createSectionEvent('mouseover', {
          screenCoordinates,
          localCoordinates
        }, nativeEvent)

        this._callback(mousedownEvent)
        this._mouseCurrentlyOverSection = true
      }
    } else {
      if (this._mouseCurrentlyOverSection) {
        this._mouseCurrentlyOverSection = false
      }
    }
  }
}
