import InteractionHandler from './InteractionHandler.js'
import SectionInteractionHandler from './SectionInteractionHandler.js'

export default class ClickHandler extends InteractionHandler {
  _addEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
<<<<<<< HEAD
      let handler = this._handleEvent.bind(this)
      let interactionManager = this._interactionManager
      let eventManager = interactionManager._eventManager
      let listenerId = interactionManager._id + '-click'
=======
      const handler = this._handleEvent.bind(this)
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-click'

>>>>>>> dce9377a55a6a8857144259233e6558678791518
      eventManager.addEventListener('click', listenerId, handler)
    }
  }

  _removeEventListenerIfNecessary () {
    if (this._numberOfInteractions === 0) {
      const interactionManager = this._interactionManager
      const eventManager = interactionManager._eventManager
      const listenerId = interactionManager._id + '-click'

      eventManager.removeEventListener('click', listenerId)
    }
  }

  _handleEvent (coordinates, mouseEvent) {
<<<<<<< HEAD
    let spatialIndex = this._spatialIndex
    let sections = this._interactionManager._sections
    
    let hits = spatialIndex.queryMouseCoordinates(coordinates)
=======
    const spatialIndex = this._spatialIndex

    const hits = spatialIndex.queryMouseCoordinates(coordinates)
>>>>>>> dce9377a55a6a8857144259233e6558678791518

    //how to remove click event signalling
    if (Object.keys(sections).length > 0) {
      for (let s in sections) {
        if (this._isInSection(coordinates, sections[s]) && this._sectionCallbacks[sections[s].sectionId]) {
          this._sectionCallbacks[sections[s].sectionId](s.sectionId, mouseEvent)
        }
      }
    }

    for (let i = 0; i < hits.length; i++) {
<<<<<<< HEAD
      let hit = hits[i]
=======
      const hit = hits[i]

>>>>>>> dce9377a55a6a8857144259233e6558678791518
      if (this._isInLayer(hit)) {
        this._layerCallbacks[hit.layerId](hit.$index, mouseEvent)
      }

      if (this._isMark(hit)) {
        this._markCallbacks[hit.markId](mouseEvent)
      }
    }
  }
}
