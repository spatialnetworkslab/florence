
import DataContainer from '../../index.js'
import getDataLength from '../../utils/getDataLength.js'
import Geostats from '../../utils/geoStats.js'

import { warn } from 'logging.js'

export default function (data, binInstructions) {
  let intervalBounds = getIntervalBounds(data, binInstructions)
  let ranges = pairRange(intervalBounds)

  let newData = bin(data, binInstructions.groupBy, ranges)
  return newData
}

export function getIntervalBounds (data, binInstructions) {
  if (binInstructions.constructor !== Object) {
    throw new Error('Bin only accepts an Object')
  }

  let key = binInstructions.groupBy
  if (key.constructor !== String) {
    throw new Error('groupBy only accepts a String variable name')
  }

  let method = binInstructions.method
  if (!method) {
    warn('No binning method specified, defaulting to EqualInterval')
    method = 'EqualInterval'
  }
  if (method.constructor !== String) {
    warn('Binning method not recognized, defaulting to EqualInterval')
    method = 'EqualInterval'
  }

  let numClasses = binInstructions.numClasses
  if (!numClasses) {
    warn('numClasses not specified, defaulting to 5')
    numClasses = 5
  }

  let variableData = data[key]
  if (!variableData) {
    throw new Error(`groupBy variable ${key} does not exist`)
  }
  let geoStat = new Geostats(variableData)

  let ranges

  // Calculate ranges to obtain bins of a specified size
  if (method === 'IntervalSize') {
    let binSize = binInstructions.binSize

    let domain = variableDomain(variableData)
    if (!binSize) {
      warn(`binSize not specified for IntervalSize binning, defaulting to ${(domain[1] - domain[0])}`)
      binSize = domain[1] - domain[0]
    }
    let binCount = Math.floor((domain[1] - domain[0]) / binSize)

    ranges = rangeFromInterval(domain, binSize, binCount)
    let newData = bin(data, key, ranges)
    return newData
  } else if (method === 'EqualInterval') {
    ranges = geoStat.getClassEqInterval(numClasses)
  } else if (method === 'StandardDeviation') {
    ranges = geoStat.getClassStdDeviation(numClasses)
  } else if (method === 'ArithmeticProgression') {
    ranges = geoStat.getClassArithmeticProgression(numClasses)
  } else if (method === 'GeometricProgression') {
    ranges = geoStat.getClassGeometricProgression(numClasses)
  } else if (method === 'Quantile') {
    ranges = geoStat.getClassQuantile(numClasses)
  } else if (method === 'Jenks') {
    ranges = geoStat.getClassJenks(numClasses)
  } else if (method === 'Manual') {
    ranges = binInstructions.manualClasses
  }

  return ranges
}

// Extract domain of variable of interest
function variableDomain (column) {
  let asc = column.sort((a, b) => a - b)

  let domain = []
  domain.push(asc[0])
  domain.push(asc[asc.length - 1])

  return domain
}

function rangeFromInterval (domain, interval, binCount) {
  let ranges = []

  // Ranges should start at the minimum value of variable of interest
  let lowerBound = domain[0]

  for (let i = 0; i < binCount; i++) {
    let upperBound = lowerBound + interval

    ranges.push([lowerBound, upperBound])

    lowerBound = upperBound
  }
  if (lowerBound < domain[1]) {
    ranges.push([lowerBound, domain[1]])
  }
  return ranges
}

function pairRange (ranges) {
  let l = ranges.length
  let newRange = []

  for (let i = 0; i < l - 1; i++) {
    newRange.push([ranges[i], ranges[i + 1]])
  }

  return newRange
}

function bin (data, variable, ranges) {
  let newData = { bins: ranges }

  // Create an empty array to store new DataContainers divided by range
  let bins = Array(ranges.length)

  for (let b = 0; b < bins.length; b++) {
    bins[b] = {}

    for (let col in data) {
      // If data key does not exist, create it
      bins[b][col] = []
    }
  }

  let length = getDataLength(data)

  // Loop through data
  for (let ix = 0; ix < length; ix++) {
    let instance = data[variable][ix]

    // Find index of bin in which the instance belongs
    let binIndex = ranges.findIndex(function (el, i) {
      if (i === ranges.length - 1) {
        return instance >= el[0] && instance <= el[1]
      } else {
        return instance >= el[0] && instance < el[1]
      }
    })

    let newRow = bins[binIndex]

    for (let col in data) {
      newRow[col].push(data[col][ix])
    }

    // Update the bins column with new DataContainer
    let dataContainer = new DataContainer(newRow)
    bins[binIndex] = dataContainer
  }

  // Add new grouped column to newData
  newData.$grouped = bins
  return newData
}
