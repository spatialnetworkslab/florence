import { ticks as arrayTicks } from 'd3-array'
import { scaleLinear, scaleOrdinal } from 'd3-scale'

export function getTicks (scale, labelCount, labelExtra, firstLabel) {
  let tickValues
  // Bins

  if (Array.isArray(scale[0]) && scale.length > 0) {
    tickValues = []
    tickValues.push(scale[0][0])

    for (let i = 0; i < scale.length; i++) {
      tickValues.push(scale[i][1])
    }
  // Array
  } else if (Array.isArray(scale)) {
    if (scale[0].constructor === Number) {
      tickValues = arrayTicks(...scale, labelCount)

      if (firstLabel !== undefined) {
        if (labelExtra && tickValues[0] !== firstLabel) {
          tickValues.unshift(firstLabel)
        }
      }
    } else {
      tickValues = scale
    }
  } else if (isContinuous(scale)) {
    tickValues = scale.ticks(labelCount)
  } else if (hasDomain(scale)) {
    tickValues = scale.domain()
  } else {
    throw new Error(`Couldn't construct legend. Please provide 'tickValues' or a scale with
        either a 'ticks' or a 'domain' method.`)
  }

  if (labelExtra && 'domain' in scale && tickValues[0] !== scale.domain()[0]) {
    tickValues.unshift(scale.domain()[0])
  }

  let finalTicks = []

  if (Array.isArray(tickValues[0])) {
    finalTicks.push(tickValues[0][0])
    for (let i = 0; i < tickValues.length; i += 1) {
      finalTicks.push(tickValues[i][1])
    }
  } else {
    finalTicks = tickValues
  }

  return finalTicks
}

function isContinuous (scale) {
  return 'ticks' in scale
}

function hasDomain (scale) {
  return 'domain' in scale
}

export function getTickPositions (tickValuesArray, scale, tickExtra, flip, padding, useScale, flipScale) {
  let tickPositions
  let domain = scale.domain()

  if (Array.isArray(domain[0])) {
    useScale = true
    domain = [domain[0][0], domain[domain.length - 1][1]]
  } else {
    // Applies to labels or 1D arrays
    if (typeof domain[0] !== typeof 'a') {
      domain = [domain[0], domain[domain.length - 1]]
    } else {
      // Applies to array with categorical values
      useScale = false
    }
  }

  // Bins
  if (useScale) {
    let posScale
    const locRange = [0, 1]

    if (flip) {
      posScale = scaleLinear().domain(domain).range(locRange.reverse())
    } else {
      posScale = scaleLinear().domain(domain).range(locRange)
    }

    tickPositions = tickValuesArray.map((value, i) => {
      return posScale(value) + padding
    })

  // Arrays
  // equal interval: works on both vertical and horizontal orientations
  } else if (useScale === false) {
    const interval = 1 / (tickValuesArray.length)
    const firstVal = 0
    tickValuesArray = flip ? tickValuesArray.reverse() : tickValuesArray

    tickPositions = tickValuesArray.map((value, i) => {
      return firstVal + interval * (i + 0.5) + padding
    })
  } else {
    throw new Error(`Couldn't construct legend. Please provide 'tickValues' or a scale with
        either a 'ticks' or a 'domain' method.`)
  }

  if (tickExtra && tickPositions[0] !== domain[0] && useScale) {
    tickPositions.unshift(domain[0])
  }

  if (flipScale) {
    tickPositions.reverse()
  }

  return tickPositions
}

export function getFormat (labelFormat, scale, numberOfTicks) {
  if (labelFormat) return labelFormat
  if ('tickFormat' in scale) return scale.tickFormat(numberOfTicks)

  return x => x
}
