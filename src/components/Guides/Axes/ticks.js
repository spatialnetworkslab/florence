import generateArrayOfLength from '../../Marks/utils/generateArrayOfLength.js'

export function getTickPositions (tickValuesArray, scale, tickCount, tickExtra, zoomIdentity) {
  let ticks

  if (Array.isArray(tickValuesArray) && tickValuesArray.length > 0) {
    ticks = tickValuesArray
  } else if (isContinuous(scale)) {
    ticks = getContinuousTicks(scale, tickCount, zoomIdentity)
  } else if ('domain' in scale) {
    ticks = scale.domain()
  } else {
    throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
      either a 'ticks' or a 'domain' method.`)
  }

  if (tickExtra && 'domain' in scale && ticks[0] !== scale.domain()[0]) {
    ticks.unshift(scale.domain()[0])
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
  yAbsolute,
  { scaleX, finalScaleY },
  tickSize,
  flip
) {
  const offset = flip ? -tickSize : tickSize
  const bandOffset = scaleX.bandwidth ? scaleX.bandwidth() / 2 : 0

  const yEndAbsolute = yAbsolute + offset

  const yCoordsTick = [
    finalScaleY.invert(yAbsolute),
    finalScaleY.invert(yEndAbsolute)
  ]

  const x = ticks.map(t => scaleX(t) + bandOffset).map(t => [t, t])
  const y = generateArrayOfLength(yCoordsTick, ticks.length)

  return {
    x: () => x,
    y: () => y
  }
}

export function getTickCoordinatesYAxis (
  ticks,
  xAbsolute,
  { scaleY, finalScaleX },
  tickSize,
  flip
) {
  const offset = flip ? tickSize : -tickSize
  const bandOffset = scaleY.bandwidth ? scaleY.bandwidth() / 2 : 0

  const xEndAbsolute = xAbsolute + offset

  const xCoordsTick = [
    finalScaleX.invert(xAbsolute),
    finalScaleX.invert(xEndAbsolute)
  ]

  const x = generateArrayOfLength(xCoordsTick, ticks.length)
  const y = ticks.map(t => scaleY(t) + bandOffset).map(t => [t, t])

  return {
    x: () => x,
    y: () => y
  }
}

export function getFormat (labelFormat, scale, numberOfTicks) {
  if (labelFormat) return labelFormat
  if ('tickFormat' in scale) return scale.tickFormat(numberOfTicks)

  return x => x
}
