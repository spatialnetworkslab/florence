import generateArrayOfLength from '../../Marks/Utils/generateArrayOfLength.js'

export function getTicks (tickValuesArray, scale, tickCount, tickExtra) {
  let ticks

  if (Array.isArray(tickValuesArray) && tickValuesArray.length > 0) {
    ticks = tickValuesArray
  } else if ('ticks' in scale) {
    ticks = scale.ticks(tickCount)
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
  const offset = flip ? -tickSize : tickSize
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
