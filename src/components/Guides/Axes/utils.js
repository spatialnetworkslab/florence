export function getTickPositions (tickValuesArray, scale, tickCount, tickExtra) {
  let tickPositions

  if (Array.isArray(tickValuesArray) && tickValuesArray.length > 0) {
    tickPositions = tickValuesArray
  } else if ('ticks' in scale) {
    tickPositions = scale.ticks(tickCount)
  } else if ('domain' in scale) {
    tickPositions = scale.domain()
  } else {
    throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
      either a 'ticks' or a 'domain' method.`)
  }

  if (tickExtra && 'domain' in scale && tickPositions[0] !== scale.domain()[0]) {
    tickPositions.unshift(scale.domain()[0])
  }

  return tickPositions
}

export function getFormat (labelFormat, scale, numberOfTicks) {
  if (labelFormat) return labelFormat
  if ('tickFormat' in scale) return scale.tickFormat(numberOfTicks)

  return x => x
}
