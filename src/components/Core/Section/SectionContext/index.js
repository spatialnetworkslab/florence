import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class SectionContext {
  constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY, padding }) {
    this._sectionId = sectionId

    this._rangeX = rangeX
    this._rangeY = rangeY

    this._scaleX = scaleX ? scaleX.copy().range(rangeX) : x => x
    this._scaleY = scaleY ? scaleY.copy().range(rangeY) : y => y

    this._padding = padding
  }

  rangeX () {
    return this._rangeX
  }

  rangeY () {
    return this._rangeY
  }

  x1 () {
    return this._rangeX[0]
  }

  x2 () {
    return this._rangeX[1]
  }

  y1 () {
    return this._rangeY[0]
  }

  y2 () {
    return this._rangeY[1]
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
