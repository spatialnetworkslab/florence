import getDataLength from '../../utils/getDataLength.js'
import DataContainer from '../../index.js'

export default function (data, groupByInstructions) {
  let groupedData = {}

  let groupedColumns = getGroupedColumns(data, groupByInstructions)
  let groups = groupBy(data, groupedColumns)

  groupedData.$grouped = groups.map(group => new DataContainer(group))
  for (let col of groupedColumns) {
    groupedData[col] = []
  }

  for (let i = 0; i < groupedColumns.length; i++) {
    let col = groupedColumns[i]

    for (let group of groups) {
      groupedData[col].push(group.groupedValues[i])
    }
  }

  return groupedData
}

function getGroupedColumns (data, groupByInstructions) {
  let con = groupByInstructions.constructor
  if (![String, Array].includes(con)) {
    throw new Error('groupBy can only be used with a string or array of strings')
  }

  let groupedColumns = con === String ? [groupByInstructions] : groupByInstructions

  for (let col of groupedColumns) {
    if (!data.hasOwnProperty(col)) {
      throw new Error(`Column '${col}' not found`)
    }
  }

  if (groupedColumns.length === Object.keys(data).length) {
    throw new Error('Cannot group by all columns')
  }

  return groupedColumns
}

function getGroupedValues (data, i, columns) {
  let groupedValues = []
  for (let col of columns) {
    groupedValues.push(data[col][i])
  }

  return groupedValues
}

function groupBy (data, groupedColumns) {
  let groups = {}

  let length = getDataLength(data)

  for (let i = 0; i < length; i++) {
    // Ge grouped values
    let groupedValues = getGroupedValues(data, i, groupedColumns)

    // Get unique identifier for group
    let groupID = JSON.stringify(groupedValues)

    // If groups object has no entry for this group yet: create new group object
    groups[groupID] = groups[groupID] || new Group(data, groupedValues)

    // Add row to group
    groups[groupID].addRow(data, i)
  }

  // Convert groups object to array
  return Object.keys(groups).map(group => {
    return groups[group]
  })
}

export class Group {
  constructor (data, groupedValues) {
    this.data = {}
    this.groupedValues = groupedValues

    for (let col in data) {
      this.data[col] = []
    }
  }

  addRow (data, i) {
    for (let col in data) {
      this.data[col].push(data[col][i])
    }
  }
}
