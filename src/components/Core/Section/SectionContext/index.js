import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class SectionContext {
  constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY, padding }) {
    this._sectionId = sectionId

    this.rangeX = rangeX[1] > rangeX[0] ? rangeX : [rangeX[1], rangeX[0]]
    this.rangeY = rangeY[1] > rangeY[0] ? rangeY : [rangeY[1], rangeY[0]]

    this.x1 = this.rangeX[0]
    this.x2 = this.rangeX[1]
    this.y1 = this.rangeY[0]
    this.y2 = this.rangeY[1]

    this._scaleX = scaleX ? scaleX.copy().range(rangeX) : x => x
    this._scaleY = scaleY ? scaleY.copy().range(rangeY) : y => y

    this._padding = padding
  }

  scales () {
    const scaleX = this._scaleX
    const scaleY = this._scaleY
    return { scaleX, scaleY }
  }

  interactionManager () {
    return this._interactionManager
  }
}

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  const sectionContext = writable()
  setContext(key, sectionContext)

  return sectionContext
}

export function update (sectionContext, options) {
  sectionContext.set(new SectionContext(options))
}
