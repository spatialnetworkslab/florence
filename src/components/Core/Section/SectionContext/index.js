import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class SectionContext {
  constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY, padding, flipX, flipY }) {
    this._sectionId = sectionId

    this.rangeX = rangeX
    this.rangeY = rangeY

    this.x1 = rangeX[1] > rangeX[0] ? rangeX[0] : rangeX[1]
    this.x2 = rangeX[1] > rangeX[0] ? rangeX[1] : rangeX[0]
    this.y1 = rangeY[1] > rangeY[0] ? rangeY[0] : rangeY[1]
    this.y2 = rangeY[1] > rangeY[0] ? rangeY[1] : rangeY[0]

    this._handleScales(scaleX, scaleY, rangeX, rangeY)

    this.flipX = flipX
    this.flipY = flipY

    this.padding = padding
  }

  _handleScales (scaleX, scaleY, rangeX, rangeY) {
    if (scaleX) {
      this.scaleX = scaleX.copy().range(rangeX)
      this.scaleX.invert = createInvertMethod(this.scaleX)
    } else {
      this.scaleX = x => x
      this.scaleX.invert = x => x
    }

    if (scaleY) {
      this.scaleY = scaleY.copy().range(rangeY)
      this.scaleY.invert = createInvertMethod(this.scaleY)
    } else {
      this.scaleY = y => y
      this.scaleY.invert = y => y
    }
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

    const flipped = upper < lower

    const domain = scale.domain()
    const lastIndex = domain.length - 1

    if (value < start + scale.padding() * scale.step()) {
      return domain[0]
    }

    if (value > stop - scale.padding() * scale.step()) {
      return domain[lastIndex]
    }

    let index

    if (isPointScale(scale)) {
      index = Math.round((value - start - scale.padding() * scale.step()) / scale.step())
    }

    if (isBandScale(scale)) {
      index = Math.round((value - start - scale.padding() * scale.step()) / scale.step())
      if (index > lastIndex) index = lastIndex
    }

    return domain[flipped ? lastIndex - index : index]
  }
}

function isPointScale (scale) {
  return !('paddingInner' in scale)
}

function isBandScale (scale) {
  return 'paddingInner' in scale
}
