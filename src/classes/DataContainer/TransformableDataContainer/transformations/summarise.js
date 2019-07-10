import aggregations from './aggregations'
import checkKeyValuePair from '../../utils/checkKeyValuePair.js'
import { checkRegularColumnName } from '../../utils/checkFormat.js'

export default function (data, summariseInstructions) {
  if (summariseInstructions.constructor !== Object) {
    throw new Error('summarise must be an object')
  }

  let newData = initNewData(summariseInstructions, data)

  if (data.hasOwnProperty('$grouped')) {
    checkSummariseInstructions(summariseInstructions, data)

    for (let columnName in data) {
      if (columnName !== '$grouped') {
        newData[columnName] = data[columnName]
      }
    }

    for (let group of data.$grouped) {
      let data = group.data()
      newData = summariseGroup(data, summariseInstructions, newData)
    }
  } else {
    newData = summariseGroup(data, summariseInstructions, newData)
  }
  return newData
}

export function initNewData (summariseInstructions, data) {
  let newData = {}
  for (let newCol in summariseInstructions) { newData[newCol] = [] }
  if (data && data.hasOwnProperty('$grouped')) {
    for (let col in data) {
      if (col !== '$grouped') {
        newData[col] = []
      }
    }
  }
  return newData
}

export function summariseGroup (data, summariseInstructions, newData) {
  for (let newColName in summariseInstructions) {
    let instruction = summariseInstructions[newColName]

    // If the aggregation instructions are an Object, only one column will be
    // used as summary: the column that is used as key in the Object
    if (instruction.constructor === Object) {
      let column = checkKeyValuePair(instruction, Object.keys(data))
      let aggregation = instruction[column]

      if (aggregation.constructor === String) {
        newData[newColName].push(aggregations[aggregation](data[column]))
      } else if (aggregation.constructor === Function) {
        newData[newColName].push(aggregation(data[column]))
      } else {
        throw new Error(`Invalid aggregation instruction: ${aggregation}. Must be String or Function`)
      }
    }
  }

  return newData
}

export function checkSummariseInstructions (summariseInstructions, data) {
  for (let newColName in summariseInstructions) {
    let instruction = summariseInstructions[newColName]
    let name = Object.keys(instruction)[0]

    checkRegularColumnName(name)

    if (data.hasOwnProperty(name)) {
      throw new Error(`Cannot summarise the column '${name}': used for grouping`)
    }
  }
}
