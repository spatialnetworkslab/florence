import SpatialIndex from './SpatialIndex.js'

export default class InteractionManager {
  constructor (markType) {
    this._spatialIndex = new SpatialIndex(markType)
    this._eventManager = undefined
  }

  linkEventManager (eventManager) {
    this._eventManager = eventManager
  }
}
