import { ticks as arrayTicks } from 'd3-array'
import { scaleLinear } from 'd3-scale'

// import { default as getDataType } from '../../../utils/getDataType.js'

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
  } else if ('ticks' in scale) {
    tickValues = scale.ticks(labelCount)
  } else if ('domain' in scale) {
    tickValues = scale.domain()
  } else {
    throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
        either a 'ticks' or a 'domain' method.`)
  }

  if (labelExtra && 'domain' in scale && tickValues[0] !== scale.domain()[0]) {
    tickValues.unshift(scale.domain()[0])
  }

  return tickValues
}

export function getTickPositions (tickValuesArray, scale, tickCount, tickExtra, locRange) {
  let tickPositions

  // Bins
  if (Array.isArray(scale[0]) && scale.length > 0) {
    const domain = [Math.min(...tickValuesArray), Math.max(...tickValuesArray)]
    const posScale = scaleLinear().domain(domain).range(locRange)

    tickPositions = tickValuesArray.map((value, i) => {
      return posScale(value)
    })

  // Arrays
  // equal interval
  } else if (Array.isArray(scale)) {
    const interval = locRange[1] / (tickValuesArray.length)
    tickPositions = tickValuesArray.map((value, i) => {
      return interval * (i + 0.5)
    })
  } else if ('ticks' in scale || 'domain' in scale) {
    let domain
    if ('domain' in scale) {
      domain = scale.domain()
    } else if ('ticks' in scale) {
      domain = scale.ticks()
    }

    const posScale = scaleLinear().domain(domain).range(locRange)

    tickPositions = tickValuesArray.map((value, i) => {
      return posScale(value)
    })
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

export function getColorGeoms (tickColors, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels) {
  let colorXStartCoords = []
  let colorXEndCoords = []
  let colorYStartCoords = []
  let colorYEndCoords = []
  console.log(tickColors, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels)
  // 1. one to one
  // 2. bins
  // vertical, horizontal

  if (orient === 'vertical') {
    colorXStartCoords = tickLabelText.map(i => {
      if (flipLabels) {
        return 0
      } else {
        return 1 - colorBarWidth
      }
    })

    colorXEndCoords = tickLabelText.map((value, i) => {
      if (flipLabels) {
        return colorBarWidth
      } else {
        return 1
      }
    })

    // Non-uniform distribution along linear scale
    if (Array.isArray(scale[0]) && scale.length > 0) {
      colorYStartCoords = tickLabelText.map(i => {
          return tickLabelPositions[i]
      })

      colorYEndCoords 
    // One to one
      }
    } else if (Array.isArray(scale)) {
      // pass
    }

  } else if (orient === 'horizontal') {
    // pass
  }

  return { colorXStartCoords, colorXEndCoords, colorYStartCoords, colorYEndCoords }
}
