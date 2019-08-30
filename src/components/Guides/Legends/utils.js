import { ticks as arrayTicks } from 'd3-array'
import { scaleLinear } from 'd3-scale'

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

export function getTickPositions (tickValuesArray, scale, tickCount, tickExtra, colorBarDimension, locRange, orient, flip) {
  let tickPositions

  // Bins
  if (Array.isArray(scale[0]) && scale.length > 0) {
    const domain = [Math.min(...tickValuesArray), Math.max(...tickValuesArray)]
    let posScale
    if (!flip) {
      posScale = scaleLinear().domain(domain).range(locRange)
    } else {
      posScale = scaleLinear().domain(domain).range(locRange.reverse())
    }

    tickPositions = tickValuesArray.map((value, i) => {
      return posScale(value)
    })

  // Arrays
  // equal interval
  } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
    const interval = orient === 'vertical' ? colorBarDimension / (tickValuesArray.length) : 1 / (tickValuesArray.length)
    if (!flip) {
      tickPositions = tickValuesArray.map((value, i) => {
        return interval * (i + 0.5)
      })
    } else {
      tickPositions = tickValuesArray.map((value, i) => {
        return colorBarDimension - interval * (i + 0.5)
      })
    }
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

export function getColorGeoms (tickMappable, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip) {
  let colorXStartCoords = []
  let colorXEndCoords = []
  let colorYStartCoords = []
  let colorYEndCoords = []

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
      colorYStartCoords = tickLabelText.map((value, i) => {
        return tickLabelPositions[i]
      })

      colorYEndCoords = tickLabelText.map((value, i) => {
        return tickLabelPositions[i]
      })

      colorXStartCoords.pop()
      colorXEndCoords.pop()
      colorYStartCoords.pop()
      colorYEndCoords.shift()
      tickMappable.pop()

    // One to one
    } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
      const interval = colorBarLength / tickMappable.length

      if (!flip) {
        let start = 0
        colorYStartCoords = tickMappable.map((value, i) => {
          if (i !== 0) {
            start += interval
            colorYEndCoords.push(start)
            return start
          } else {
            return start
          }
        })

        colorYEndCoords.push(start + interval)
      } else {
        let start = colorBarLength
        colorYStartCoords = tickMappable.map((value, i) => {
          if (i !== 0) {
            start -= interval
            colorYEndCoords.push(start)
            return start
          } else {
            return start
          }
        })

        colorYEndCoords.push(start - interval)
      }
    }
  } else if (orient === 'horizontal') {
    colorYStartCoords = tickLabelText.map(i => {
      if (flipLabels) {
        return 0
      } else {
        return 0.125
      }
    })

    colorYEndCoords = tickLabelText.map((value, i) => {
      if (flipLabels) {
        return 1.125 - colorBarLength
      } else {
        return 0.25 + colorBarLength
      }
    })

    // Non-uniform distribution along linear scale
    if (Array.isArray(scale[0]) && scale.length > 0) {
      colorXStartCoords = tickLabelText.map((value, i) => {
        if (i === 0) {
          return tickLabelPositions[i] - 0.02
        }
        return tickLabelPositions[i]
      })

      colorXEndCoords = tickLabelText.map((value, i) => {
        if (i === tickLabelText.length - 1) {
          return tickLabelPositions[i] + 0.02
        }
        return tickLabelPositions[i]
      })

      colorYStartCoords.pop()
      colorYEndCoords.pop()
      colorXStartCoords.pop()
      colorXEndCoords.shift()
      tickMappable.pop()

    // One to one
    } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
      const interval = colorBarWidth / tickMappable.length

      if (!flip) {
        let start = 0
        colorXStartCoords = tickMappable.map((value, i) => {
          if (i !== 0) {
            start += interval
            colorXEndCoords.push(start)
            return start
          } else {
            return start
          }
        })

        colorXEndCoords.push(start + interval)
      } else {
        let start = 1
        colorXStartCoords = tickMappable.map((value, i) => {
          if (i !== 0) {
            start -= interval
            colorXEndCoords.push(start)
            return start
          } else {
            return start
          }
        })

        colorXEndCoords.push(start - interval)
      }
    }
  }
  return { colorXStartCoords, colorXEndCoords, colorYStartCoords, colorYEndCoords }
}

export function getGradientGeoms (tickMappable, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip) {
  let offsets 
  let opacities

  if (Array.isArray(scale[0]) && scale.length > 0) {

  // Array
  } else if (Array.isArray(scale)) {
  
  } else if ('ticks' in scale || 'domain' in scale) {
  } else {
    throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
        either a 'ticks' or a 'domain' method.`)
  }


  return { offsets, opacities }
}
