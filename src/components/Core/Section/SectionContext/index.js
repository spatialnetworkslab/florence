import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class SectionContext {
  constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY, padding, flipX, flipY }) {
    this._sectionId = sectionId

    this.rangeX = rangeX[1] > rangeX[0] ? rangeX : [rangeX[1], rangeX[0]]
    this.rangeY = rangeY[1] > rangeY[0] ? rangeY : [rangeY[1], rangeY[0]]

    this.x1 = this.rangeX[0]
    this.x2 = this.rangeX[1]
    this.y1 = this.rangeY[0]
    this.y2 = this.rangeY[1]

    this._handleScales(scaleX, scaleY, rangeX, rangeY)

    this._padding = padding
  }

  _handleScales (scaleX, scaleY, rangeX, rangeY) {
    if (scaleX) {
      this._scaleX = scaleX.copy().range(rangeX)
      this._scaleX.invert = createInvertMethod(this._scaleX)
    } else {
      this._scaleX = x => x
      this._scaleX.invert = x => x
    }

    if (scaleY) {
      this._scaleY = scaleY.copy().range(rangeY)
      this._scaleY.invert = createInvertMethod(this._scaleY)
    } else {
      this._scaleY = y => y
      this._scaleY.invert = y => y
    }
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

/**
 * Taken from react-vis:
 * https://github.com/uber/react-vis/blob/master/src/utils/scales-utils.js#L161
 */
function createInvertMethod (scale) {
  if (scale.invert) {
    return scale.invert
  }

  return function invert (value) {
    const [lower, upper] = scale.range()
    const start = Math.min(lower, upper)
    const stop = Math.max(lower, upper)

    if (value < start + scale.padding() * scale.step()) {
      return scale.domain()[0]
    }

    if (value > stop - scale.padding() * scale.step()) {
      return scale.domain()[scale.domain().length - 1]
    }

    const index = Math.floor((value - start - scale.padding() * scale.step()) / scale.step())
    return scale.domain()[index]
  }
}
