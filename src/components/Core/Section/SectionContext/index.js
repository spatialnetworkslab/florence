import { scaleLinear } from 'd3-scale'
import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class SectionContext {
  constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY, padding, flipX, flipY, blockReindexing }) {
    this._sectionId = sectionId

    this.rangeX = rangeX
    this.rangeY = rangeY

    this.minX = Math.min(...rangeX)
    this.maxX = Math.max(...rangeX)
    this.minY = Math.min(...rangeY)
    this.maxY = Math.max(...rangeY)

    this.padding = padding

    this._handleScales(scaleX, scaleY)

    this.flipX = flipX
    this.flipY = flipY

    this.blockReindexing = blockReindexing
  }

  _handleScales (scaleX, scaleY) {
    if (scaleX) {
      this.scaleX = scaleX.copy().range(this.rangeX)
      this.scaleX.invert = createInvertMethod(this.scaleX)
    } else {
      const domainX = [this.minX - this.padding.left, this.maxX + this.padding.right]
      this.scaleX = scaleLinear().domain(domainX).range(this.rangeX)
    }

    if (scaleY) {
      this.scaleY = scaleY.copy().range(this.rangeY)
      this.scaleY.invert = createInvertMethod(this.scaleY)
    } else {
      const domainY = [this.minY - this.padding.top, this.maxY + this.padding.bottom]
      this.scaleY = scaleLinear().domain(domainY).range(this.rangeY)
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
