import getDataType from './getDataType.js'
import { calculateBbox } from '../../../utils/geojson.js'
import { isInvalid } from '../../../utils/equals.js'
import { warn } from '../../../utils/logging.js'

export default function (data) {
  let domains = {}
  let types = {}

  for (let columnName in data) {
    let column = data[columnName]

    let { domain, type } = calculateColumnDomainAndGetType(column, columnName)

    domains[columnName] = domain
    types[columnName] = type
  }

  return { domains, types }
}

function calculateColumnDomainAndGetType (column, columnName) {
  let { firstValidValue, nValidValues } = findFirstValidValue(column)

  if (nValidValues === 0) {
    throw new Error(`Column '${column}' contains only missing values. This is not allowed.`)
  }

  if (nValidValues > 0) {
    let type = getDataType(firstValidValue)
    let domain

    if (columnName === '$geometry') {
      domain = calculateBbox(column)
    }

    if (columnName !== '$geometry') {
      domain = calculateColumnDomain(column, columnName, nValidValues, firstValidValue, type)
    }

    return { domain, type }
  }
}

export function findFirstValidValue (column) {
  let firstValidValue
  let nValidValues = 0

  for (let i = 0; i < column.length; i++) {
    if (!isInvalid(column[i])) {
      nValidValues++
      firstValidValue = firstValidValue || column[i]
    }

    if (nValidValues > 1) break
  }

  return { firstValidValue, nValidValues }
}

function calculateColumnDomain (column, columnName, nValidValues, firstValidValue, type) {
  let domain
  let nUniqueValues = calculateNumberOfUniqueValues(column)

  if (isIrregularColumn(nValidValues, nUniqueValues)) {
    domain = calculateDomainForIrregularColumn(nValidValues, nUniqueValues, type, firstValidValue, columnName)
  } else {
    domain = calculateDomainForRegularColumn(type, column, columnName)
  }

  return domain
}

function calculateNumberOfUniqueValues (col) {
  let uniqueVals = {}
  for (let val of col) {
    let str = JSON.stringify(val)
    uniqueVals[str] = 0
  }

  return Object.keys(uniqueVals).length
}

function isIrregularColumn (nValidValues, nUniqueValues) {
  return nValidValues === 1 || nUniqueValues === 1
}

function calculateDomainForIrregularColumn (nValidValues, nUniqueValues, type, firstValidValue, columnName) {
  let domain

  if (nValidValues === 1) {
    domain = createDomainForSingleValue(type, firstValidValue)

    if (type !== 'categorical') {
      warn(
        `Column '${columnName}' contains only 1 valid value: ${firstValidValue}.\n` +
        `Using domain ${JSON.stringify(domain)}`
      )
    }
  } else if (nUniqueValues === 1) {
    domain = createDomainForSingleValue(type, firstValidValue)

    if (type !== 'categorical') {
      warn(
        `Column '${columnName}' contains only 1 unique value: ${firstValidValue}.\n` +
        `Using domain ${JSON.stringify(domain)}`
      )
    }
  }

  return domain
}

function calculateDomainForRegularColumn (type, column, columnName) {
  let domain = initDomain(type)

  for (let i = 0; i < column.length; i++) {
    let value = column[i]

    if (!isInvalid(value)) {
      if (getDataType(value) !== type) {
        throw new Error(`Invalid column ${columnName}: column contains multiple data types`)
      }

      domain = updateDomain(domain, value, type)
    }
  }

  return domain
}

const minUnixTime = new Date(0)
const maxUnixTime = new Date('19 January 2038')

function initDomain (type) {
  let domain
  switch (type) {
    case 'quantitative': {
      domain = [Infinity, -Infinity]
      break
    }
    case 'categorical': {
      domain = []
      break
    }
    case 'temporal': {
      domain = [maxUnixTime, minUnixTime]
      break
    }
    case 'interval': {
      domain = [Infinity, -Infinity]
      break
    }
  }

  return domain
}

function updateDomain (domain, value, type) {
  if (type === 'quantitative') {
    if (domain[0] >= value) { domain[0] = value }
    if (domain[1] <= value) { domain[1] = value }
  }

  if (type === 'categorical') {
    if (!domain.includes(value)) { domain.push(value) }
  }

  if (type === 'temporal') {
    let epoch = value.getTime()

    if (domain[0].getTime() >= epoch) { domain[0] = value }
    if (domain[1].getTime() <= epoch) { domain[1] = value }
  }

  if (type === 'interval') {
    domain = updateDomain(domain, value[0], 'quantitative')
    domain = updateDomain(domain, value[1], 'quantitative')
  }

  return domain
}

function createDomainForSingleValue (type, value) {
  let domain

  if (type === 'quantitative') {
    domain = [value - 1, value + 1]
  }

  if (type === 'categorical') {
    domain = [value]
  }

  if (type === 'temporal') {
    domain = [getDay(value, -1), getDay(value, 1)]
  }

  if (type === 'interval') {
    domain = value.sort((a, b) => a > b)
  }

  return domain
}

function getDay (date, days) {
  let dateCopy = new Date(date.getTime())
  return new Date(dateCopy.setDate(dateCopy.getDate() + days))
}
