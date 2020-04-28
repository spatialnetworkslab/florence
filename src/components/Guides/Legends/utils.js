import { scaleLinear } from 'd3-scale'
import { isContinuous, hasDomain } from './ticks.js'

// if x1, x2, y1, y2 are values, functions => return true
// if x1, x2, y1, y2 are all undefined => return false
// if neither are fulfilled => raise error
export function isValid (x1, x2, y1, y2) {
  let validVariables = 0

  for (const value in [x1, x2, y1, y2]) {
    if (checkValidType(value)) {
      validVariables += 1
    }
  }

  if (validVariables < 4) {
    throw new Error('Couldn\'t construct legend because of invalid x1, x2, y1, y2 inputs.')
  } else if (validVariables === 4 && x1 === undefined && x2 === undefined && y1 === undefined && y2 === undefined) {
    return false
  }

  return true
}

function checkValidType (value) {
  if (!isNaN(value) || {}.toString.call(value) === '[object Function]' || value === undefined) {
    return true
  }

  return false
}

export function getMappable(property, scale, mapRange, ticks) {
  const mapRangeType = typeof mapRange

  if (!mapRangeType in ['object', 'function', 'number', 'string']) {
    throw new Error(`Couldn't construct legend. Please provide 'tickValues' or a scale with
        either a 'ticks' or a 'domain' method.`)
  }

  if (scale && mapRange !== undefined && mapRangeType === 'object') {
    if (typeof scale === 'function' && hasDomain(scale)) {
      console.log(scale.domain())
      const fullScale = scale.domain(ticks).range(mapRange)

      // d3 scale or bins
      const mapValues = ticks.map((value, i) => {
        return (fullScale(value))
      })
      console.log('+++', mapValues, scale.domain())
      return mapValues
    }
  } else {
    return mapRange
  }
}

// Check if color input is valid RGB/HTML color
export function checkValidColor (color) {
  let e = document.getElementById('divValidColor')

  if (!e) {
    e = document.createElement('div')
    e.id = 'divValidColor'
  }
  e.style.borderColor = ''
  e.style.borderColor = color

  let tempcolor = e.style.borderColor

  if (tempcolor.length === 0) {
    return false
  }
  return true
}

export function getColorGeoms (mappableArray, orient, scale, tickLabelPositions, tickAlign, useScale, flipLabelOrder, flipX, flipY) {
  let colorXStartCoords = []
  let colorXEndCoords = []
  let colorYStartCoords = []
  let colorYEndCoords = []
  let domain = scale.domain()

  if (orient === 'vertical') {
    console.log(orient)
    // // x coords
    // colorXStartCoords = tickLabelText.map(i => {
    //   if (flipLabels) {
    //     return tickAlign - labelFontSize * 2 - colorBarWidth * xCoords.width
    //   } else {
    //     return tickAlign + labelFontSize * 2
    //   }
    // })

    // colorXEndCoords = tickLabelText.map((value, i) => {
    //   if (flipLabels) {
    //     return tickAlign - labelFontSize * 2
    //   } else {
    //     return tickAlign + labelFontSize * 2 + colorBarWidth * xCoords.width
    //   }
    // })

    // // y coords
    // // Non-uniform distribution along linear scale
    // if (useScale) {
    //   colorYStartCoords = tickLabelText.map((value, i) => {
    //     return tickLabelPositions[i]
    //   })

    //   colorYEndCoords = JSON.parse(JSON.stringify(colorYStartCoords))

    //   colorXStartCoords.pop()
    //   colorXEndCoords.pop()
    //   colorYStartCoords.pop()
    //   colorYEndCoords.shift()
    //   tickMappable.pop()

    // Arrays or one tick to one box
    // } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
    //   const interval = 1 / tickMappable.length
    //   let start = yCoords.y1
    //   colorYStartCoords = tickMappable.map((value, i) => {
    //     if (i > 0) {
    //       start += interval
    //       colorYEndCoords.push(start)
    //     }
    //     return start
    //   })

    //   colorYEndCoords.push(start + interval)
    // }

    // if (flipScale) {
    //   colorYStartCoords.reverse()
    //   colorYEndCoords.reverse()
    // }
  } else if (orient === 'horizontal') {
    colorYStartCoords = tickLabelPositions.map(i => { return 0 })
    colorYEndCoords = tickLabelPositions.map(i => { return 1 })
    console.log('___', tickLabelPositions)

    // Bins: follows tick location
    // Non-uniform distribution along linear scale
    if (useScale) {
      colorXStartCoords = tickLabelPositions.map((value, i) => {
        if (i === 0) {
          return tickLabelPositions[i] - 0.02
        }
        return tickLabelPositions[i]
      })

      colorXEndCoords = tickLabelPositions.map((value, i) => {
        if (i === tickLabelPositions.length - 1) {
          return tickLabelPositions[i] + 0.02
        }
        return tickLabelPositions[i]
      })

      colorYStartCoords.pop()
      colorYEndCoords.pop()
      colorXStartCoords.pop()
      colorXEndCoords.shift()
      mappableArray.pop()
      console.log(colorXStartCoords, colorXEndCoords, mappableArray)
      if (flipLabelOrder) {
        colorXStartCoords.reverse()
        colorXEndCoords.reverse()
      }

    // One to one
    } else if (Array.isArray(scale) || ('ticks' in scale || 'domain' in scale)) {
      const interval = Math.abs(xCoords.x2 - xCoords.x1) / tickMappable.length
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

    // if (flipScale) {
    //   colorXStartCoords.reverse()
    //   colorXEndCoords.reverse()
    // }
  }

  return { colorXStartCoords, colorXEndCoords, colorYStartCoords, colorYEndCoords }
}

export function getGradientGeoms (tickMappable, orient, scale, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, tickAlign, labelFontSize, labels, flipScale) {
  let offsets
  let gradX
  let gradY
  let x1
  let x2
  let y1
  let y2

  if (orient === 'vertical') {
    gradX = { x1: '0%', x2: '0%' }
    gradY = flip || flipScale ? { y1: '0%', y2: '100%' } : { y1: '100%', y2: '0%' }
    y1 = yCoords.y1
    y2 = yCoords.y2

    // Color bar dimensions
    if (flipLabels) {
      x1 = tickAlign - labelFontSize * 2 - colorBarWidth * xCoords.width
      x2 = tickAlign - labelFontSize * 2
    } else {
      x1 = tickAlign + labelFontSize * 2
      x2 = tickAlign + labelFontSize * 2 + colorBarWidth * xCoords.width
    }
  } else if (orient === 'horizontal') {
    gradX = flip || !flipScale ? { x1: '100%', x2: '0%' } : { x1: '0%', x2: '100%' }
    gradY = { y1: '0%', y2: '0%' }
    x1 = xCoords.x1
    x2 = xCoords.x2

    // Color bar dimensions
    if (flipLabels) {
      y1 = tickAlign + labelFontSize * 2
      y2 = tickAlign + colorBarHeight * yCoords.height + labelFontSize * 2
    } else {
      y1 = tickAlign - colorBarHeight * yCoords.height - labelFontSize * 2
      y2 = tickAlign - labelFontSize * 2
    }
  }

  const rectCoords = { x1, x2, y1, y2 }

  // Gradient bar color offset assignment
  // Bins
  if (labels) {
    let posScale
    if (!flip) {
      posScale = scaleLinear().domain(scale.domain()).range([0, 1])
    } else {
      posScale = scaleLinear().domain(scale.domain()).range([1, 0])
    }

    offsets = labels.map((value, i) => {
      if (!flip) {
        return posScale(value)
      } else {
        return 1 - posScale(value)
      }
    })

  // Array or scale
  // Fix
  } else if (labels === undefined) {
    const interval = 1 / tickMappable.length

    offsets = tickMappable.map((value, i) => {
      return interval * (i + 0.5)
    })
  } else {
    throw new Error(`Couldn't construct legend. Please provide 'tickValues' or a scale with
        either a 'ticks' or a 'domain' method.`)
  }

  return { offsets, gradX, gradY, rectCoords }
}
