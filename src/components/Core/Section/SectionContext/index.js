import { scaleLinear } from 'd3-scale'
import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

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
  sectionContext.set(createSectionContext(options))
}

function createSectionContext ({
  scaleX: _scaleX,
  scaleY: _scaleY,
  ...sectionContext
}) {
  const { scaleX, scaleY } = setupScales(_scaleX, _scaleY, sectionContext)

  return {
    scaleX,
    scaleY,
    ...sectionContext
  }
}

function setupScales (_scaleX, _scaleY, sctx) {
  let scaleX
  let scaleY

  if (_scaleX) {
    scaleX = _scaleX.copy().range(sctx.rangeX)
    scaleX.invert = createInvertMethod(scaleX)
  } else {
    const domainX = [sctx.minX - sctx.padding.left, sctx.maxX + sctx.padding.right]
    scaleX = scaleLinear().domain(domainX).range(sctx.rangeX)
  }

  if (_scaleY) {
    scaleY = _scaleY.copy().range(sctx.rangeY)
    scaleY.invert = createInvertMethod(scaleY)
  } else {
    const domainY = [sctx.minY - sctx.padding.top, sctx.maxY + sctx.padding.bottom]
    scaleY = scaleLinear().domain(domainY).range(sctx.rangeY)
  }

  return { scaleX, scaleY }
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
