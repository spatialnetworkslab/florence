import { findFirstValidValue } from './calculateDomainsAndGetTypes.js'
import getDataType from './getDataType.js'

export default function (data) {
  return cloneDataframe(data)
}

function cloneDataframe (dataframe) {
  let newDataframe = {}

  for (let columnName in dataframe) {
    let column = dataframe[columnName]

    if (columnName === '$grouped') {
      newDataframe.$grouped = cloneGroupedColumn(column)
    }

    if (columnName !== '$grouped') {
      newDataframe[columnName] = cloneColumn(column)
    }
  }

  return newDataframe
}

function cloneGroupedColumn (groupedColumn) {
  let newColumn = []

  for (let dataframe of groupedColumn) {
    let clonedDataframe = cloneDataframe(dataframe)
    newColumn.push(clonedDataframe)
  }

  return newColumn
}

function cloneColumn (column) {
  let { firstValidValue, nValidValues } = findFirstValidValue(column)

  if (nValidValues === 0) {
    return createColumnFullOfNulls(column.length)
  }

  let type = getDataType(firstValidValue)

  if (type === 'temporal') {
    return cloneTemporal(column)
  } else if (type === 'interval:temporal') {
    return cloneIntervalTemporal(column)
  } else {
    return clone(column)
  }
}

function createColumnFullOfNulls (length) {
  return new Array(length).fill(null)
}

function clone (column) {
  return JSON.parse(JSON.stringify(column))
}

function cloneTemporal (column) {
  return clone(column).map(date => new Date(date))
}

function cloneIntervalTemporal (column) {
  return clone(column).map(interval => interval.map(date => new Date(date)))
}