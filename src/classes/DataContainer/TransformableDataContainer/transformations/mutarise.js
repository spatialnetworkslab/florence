import { initNewData, summariseGroup, checkSummariseInstructions } from './summarise.js'
import getDataLength from '../../utils/getDataLength.js'

export default function (data, mutariseInstructions) {
  if (mutariseInstructions.constructor !== Object) {
    throw new Error('mutarise must be an object')
  }

  let newCols = initNewData(mutariseInstructions)

  if (data.hasOwnProperty('$grouped')) {
    checkSummariseInstructions(mutariseInstructions, data)

    for (let group of data.$grouped) {
      let summarizedData = initNewData(mutariseInstructions)
      let dataInGroup = group.data()
      summarizedData = summariseGroup(dataInGroup, mutariseInstructions, summarizedData)

      let length = getDataLength(dataInGroup)
      newCols = addGroupSummaries(newCols, summarizedData, length)
    }

    data = ungroup(data)
  } else {
    let summarizedData = initNewData(mutariseInstructions)
    summarizedData = summariseGroup(data, mutariseInstructions, summarizedData)

    let length = getDataLength(data)
    newCols = addGroupSummaries(newCols, summarizedData, length)
  }

  return join(data, newCols)
}

function addGroupSummaries (newCols, summarizedData, length) {
  for (let i = 0; i < length; i++) {
    for (let key in summarizedData) {
      newCols[key].push(summarizedData[key][0])
    }
  }

  return newCols
}

function ungroup (data) {
  let newData = initNewData(data.$grouped[0].data())

  for (let group of data.$grouped) {
    let groupData = group.data()
    for (let col in newData) {
      newData[col].push(...groupData[col])
    }
  }

  return newData
}

function join (data, newCols) {
  for (let col in newCols) {
    data[col] = newCols[col]
  }

  return data
}
