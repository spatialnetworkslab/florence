import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class SectionContext {
  constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY, padding, flipX, flipY }) {
    this._sectionId = sectionId

    this._rangeX = undefined
    this._rangeY = undefined
    this._scaleX = undefined
    this._scaleY = undefined
    this.flipX = flipX
    this.flipY = flipY
    this.padding = padding

    this._handleRanges(rangeX, rangeY)
    this._handleScales(scaleX, scaleY)

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

  _handleRanges (rangeX, rangeY) {
    this._rangeX = rangeX
    this._rangeY = rangeY
  }

  _handleScales (scaleX, scaleY) {
    if (scaleX) {
      this._scaleX = scaleX.copy().range(this._rangeX)
    }

    if (!scaleX) {
      this._scaleX = x => x
    }

    if (scaleY) {
      this._scaleY = scaleY.copy().range(this._rangeY)
    }

    if (!scaleY) {
      this._scaleY = y => y
    }
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
