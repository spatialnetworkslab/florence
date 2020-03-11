import { scaleLinear } from 'd3-scale'

export function createScales (sectionData, { rangeX, rangeY }) {
  return {
    scaleX: createScaleX(sectionData, rangeX),
    scaleY: createScaleY(sectionData, rangeY)
  }
}

function createScaleX ({ coordinates, transformation, scaleX }, rangeX) {
  const range = transformation === 'polar'
    ? [0, 2 * Math.PI]
    : rangeX

  if (scaleX) {
    const scale = scaleX.copy().range(range)
    scale.invert = createInvertMethod(scale)

    return scale
  }

  if (!scaleX) {
    return scaleLinear().domain(rangeX).range(range)
  }
}

function createScaleY ({ coordinates, transformation, scaleY }, rangeY) {
  const range = transformation === 'polar'
    ? [0, 1]
    : rangeY

  if (scaleY) {
    const scale = scaleY.copy().range(range)
    scale.invert = createInvertMethod(scale)

    return scale
  }

  if (!scaleY) {
    return scaleLinear().domain(rangeY).range(range)
  }
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

export function createFinalScales ({ rangeX, rangeY }, { finalRangeX, finalRangeY }) {
  const finalScaleX = scaleLinear().domain(rangeX).range(finalRangeX)
  const finalScaleY = scaleLinear().domain(rangeY).range(finalRangeY)

  return { finalScaleX, finalScaleY }
}
