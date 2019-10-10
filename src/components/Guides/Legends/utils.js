import { ticks as arrayTicks } from 'd3-array'
import { scaleLinear } from 'd3-scale'

export function isValid (x1, x2, y1, y2) {
  if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y2)) {
    return true
  }
  return false
}

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

export function getTickPositions (tickValuesArray, scale, tickExtra, locRange, flip) {
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
  // equal interval: works on both vertical and horizontal orientations
  } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
    const interval = (locRange[1] - locRange[0]) / (tickValuesArray.length)
    if (flip) tickValuesArray.reverse()
    tickPositions = tickValuesArray.map((value, i) => {
      return locRange[1] - interval * (i + 0.5)
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

export function getColorGeoms (tickMappable, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip, xCoords, yCoords) {
  let colorXStartCoords = []
  let colorXEndCoords = []
  let colorYStartCoords = []
  let colorYEndCoords = []

  if (orient === 'vertical') {
    const coordsWidth = xCoords.x2 - xCoords.x1

    // x coordinates
    colorXStartCoords = tickLabelText.map(i => {
      if (flipLabels) {
        return xCoords.x1
      } else {
        if (colorBarWidth <= 1) {
          return xCoords.x2 - colorBarWidth * coordsWidth
        } else {
          return xCoords.x2 - colorBarWidth
        }
      }
    })

    colorXEndCoords = tickLabelText.map((value, i) => {
      if (flipLabels) {
        if (colorBarWidth <= 1) {
          return xCoords.x2 - (1 - colorBarWidth) * coordsWidth
        } else {
          return xCoords.x2 - colorBarWidth
        }
      } else {
        return xCoords.x2
      }
    })
    console.log('+++', colorXStartCoords)
    // y coords
    // Non-uniform distribution along linear scale
    if (Array.isArray(scale[0]) && scale.length > 0) {
      colorYStartCoords = tickLabelText.map((value, i) => {
        return tickLabelPositions[i]
      })

      colorYEndCoords = JSON.parse(JSON.stringify(colorYStartCoords))

      colorXStartCoords.pop()
      colorXEndCoords.pop()
      colorYStartCoords.pop()
      colorYEndCoords.shift()
      tickMappable.pop()

    // One to one
    } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
      const interval = (yCoords.y2 - yCoords.y1) / tickMappable.length
      let start = yCoords.y2
      colorYStartCoords = tickMappable.map((value, i) => {
        if (i > 0) {
          start -= interval
          colorYEndCoords.push(start)
        }
        return start
      })

      colorYEndCoords.push(start - interval)
    }
  } else if (orient === 'horizontal') {
    const coordsLength = yCoords.y2 - yCoords.y1

    colorYStartCoords = tickLabelText.map(i => {
      if (flipLabels) {
        if (colorBarLength <= 1) {
          return yCoords.y1 + (1 - colorBarLength) * coordsLength
        } else {
          return colorBarLength
        }
      } else {
        return yCoords.y1
      }
    })

    colorYEndCoords = tickLabelText.map((value, i) => {
      if (flipLabels) {
        return yCoords.y2
      } else {
        if (colorBarLength <= 1) {
          return yCoords.y1 + colorBarLength * coordsLength
        } else {
          return colorBarLength
        }
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
      const interval = (xCoords.x2 - xCoords.x1) / tickMappable.length
      let start = xCoords.x1
      colorXStartCoords = tickMappable.map((value, i) => {
        if (i > 0) {
          start += interval
          colorXEndCoords.push(start)
        }
        return start
      })

      colorXEndCoords.push(start + interval)
    }
  }

  return { colorXStartCoords, colorXEndCoords, colorYStartCoords, colorYEndCoords }
}

export function getGradientGeoms (tickMappable, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip) {
  let offsets
  let gradX
  let gradY
  let rectCoords

  if (flip) {
    tickMappable = tickMappable.reverse()
  }

  if (orient === 'vertical') {
    gradX = { x1: '0%', x2: '0%' }
    gradY = { y1: '100%', y2: '0%' }

    // Bins
    if (!flipLabels) {
      rectCoords = { x1: 1 - colorBarWidth, x2: 1, y1: 0, y2: colorBarLength }
    } else {
      rectCoords = { x1: 0, x2: colorBarWidth, y1: 0, y2: colorBarLength }
    }

    if (Array.isArray(scale[0]) && scale.length > 0) {
      offsets = tickMappable.map((value, i) => {
        if (flip) {
          return 1 - tickLabelPositions[i]
        } else {
          return tickLabelPositions[i]
        }
      })

    // Array or scale
    } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
      const interval = colorBarLength / tickMappable.length

      offsets = tickMappable.map((value, i) => {
        return interval * (i + 0.5)
      })
    } else {
      throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
          either a 'ticks' or a 'domain' method.`)
    }
  } else if (orient === 'horizontal') {
    gradX = { x1: '0%', x2: '100%' }
    gradY = { y1: '0%', y2: '0%' }

    if (!flipLabels) {
      rectCoords = { y1: 0.15, y2: 0.2 + colorBarLength }
    } else {
      rectCoords = { y1: 0, y2: 1.15 - colorBarLength }
    }

    // Bins
    if (Array.isArray(scale[0]) && scale.length > 0) {
      offsets = tickMappable.map((value, i) => {
        if (flip) {
          return 1 - tickLabelPositions[i]
        } else {
          return tickLabelPositions[i]
        }
      })

      rectCoords.x1 = 0.05
      rectCoords.x2 = 0.95

    // Array or scale
    } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
      const interval = colorBarWidth / tickMappable.length

      offsets = tickMappable.map((value, i) => {
        return interval * (i + 0.5)
      })

      rectCoords.x1 = 0
      rectCoords.x2 = 1
    } else {
      throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
          either a 'ticks' or a 'domain' method.`)
    }
  }
  return { offsets, gradX, gradY, rectCoords }
}
