export function getTickPositions (tickValuesArray, directScale, tickCount, tickExtra, zoomIdentity) {
  let ticks

  if (Array.isArray(tickValuesArray) && tickValuesArray.length > 0) {
    ticks = tickValuesArray
  } else if (isContinuous(directScale)) {
    ticks = getContinuousTicks(directScale, tickCount, zoomIdentity)
  } else if ('domain' in directScale) {
    ticks = directScale.domain()
  } else {
    throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
      either a 'ticks' or a 'domain' method.`)
  }

  if (tickExtra && 'domain' in directScale && ticks[0] !== directScale.domain()[0]) {
    ticks.unshift(directScale.domain()[0])
  }

  return ticks
}

function isContinuous (scale) {
  return 'ticks' in scale
}

function getContinuousTicks (scale, tickCount, zoomIdentity) {
  if (zoomIdentity) {
    const rescaledDomain = rescale(scale, zoomIdentity)
    return scale.copy().domain(rescaledDomain).ticks(tickCount)
  }

  return scale.ticks(tickCount)
}

// https://github.com/d3/d3-zoom#transform_rescaleX
function rescale (scale, { k, t }) {
  const rescaledRange = scale.range().map(r => (r - t) / k)
  const rescaledDomain = rescaledRange.map(scale.invert)

  return rescaledDomain
}

export function getTickCoordinatesXAxis (
  ticks,
  yAbs,
  tickSize,
  flip
) {
  const yOffset = flip ? -tickSize : tickSize

  return {
    x: ({ scaleX, bwx }) => {
      const bandOffset = bwx ? bwx() / 2 : 0
      return ticks.map(t => scaleX(t) + bandOffset).map(t => [t, t])
    },
    y: ({ py, pyAt }) => { const y = pyAt(yAbs); return ticks.map(_ => [y, y + py(yOffset)]) }
  }
}

export function getTickCoordinatesYAxis (
  ticks,
  xAbs,
  tickSize,
  flip
) {
  const xOffset = flip ? tickSize : -tickSize

  return {
    x: ({ px, pxAt }) => { const x = pxAt(xAbs); return ticks.map(_ => [x, x + px(xOffset)]) },
    y: ({ scaleY, bwy }) => {
      const bandOffset = bwy ? bwy() / 2 : 0
      return ticks.map(t => scaleY(t) + bandOffset).map(t => [t, t])
    }
  }
}

export function getFormat (labelFormat, scale, numberOfTicks) {
  if (labelFormat) return labelFormat
  if ('tickFormat' in scale) return scale.tickFormat(numberOfTicks)

  return x => x
}
