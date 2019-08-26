import { scaleLinear } from 'd3-scale'
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

    this._handleScales(scaleX, scaleY)

    this.flipX = flipX
    this.flipY = flipY

    this.padding = padding
  }

  _handleScales (scaleX, scaleY) {
    if (scaleX) {
      this.scaleX = scaleX.copy().range(this.rangeX)
      this.scaleX.invert = createInvertMethod(this.scaleX)
    } else {
      this.scaleX = scaleLinear().domain([this.x1, this.x2]).range(this.rangeX)
    }

    if (scaleY) {
      this.scaleY = scaleY.copy().range(this.rangeY)
      this.scaleY.invert = createInvertMethod(this.scaleY)
    } else {
      this.scaleY = scaleLinear().domain([this.y1, this.y2]).range(this.rangeY)
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

/**
 * Taken from react-vis:
 * https://github.com/uber/react-vis/blob/master/src/utils/scales-utils.js#L161
 *
 * By default, d3.scaleBand and d3.scalePoint do not have an .invert method, which is why
 * we are doing this. There are some PRs open for this, though, so hopefully we can
 * get rid of this in the future:
 * - https://github.com/d3/d3-scale/pull/151
 * - https://github.com/d3/d3-scale/pull/60
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
