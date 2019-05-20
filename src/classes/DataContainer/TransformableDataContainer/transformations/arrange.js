import getDataType from '../../utils/getDataType.js'

export default function (data, sortInstructions) {
  if (sortInstructions.constructor === Object) {
    sort(data, sortInstructions)
  } else if (sortInstructions.constructor === Array) {
    for (let i = sortInstructions.length - 1; i >= 0; i--) {
      let instruction = sortInstructions[i]
      sort(data, instruction)
    }
  } else {
    throw new Error('arrange requires a key-value object or array of key-value objects')
  }
}

const sortFuncs = {
  quantitative: {
    // https://beta.observablehq.com/@mbostock/manipulating-flat-arrays
    ascending: (a, b) => a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN,
    descending: (a, b) => b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
  },
  categorical: {
    ascending: (a, b) => {
      let sorted = [a, b].sort()
      return sorted[0] === a ? -1 : 1
    },
    descending: (a, b) => {
      let sorted = [a, b].sort()
      return sorted[0] === a ? 1 : -1
    }
  },
  temporal: {
    ascending: (c, d) => {
      let a = c.getTime()
      let b = c.getTime()
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
    },
    descending: (c, d) => {
      let a = c.getTime()
      let b = c.getTime()
      return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
    }
  }
}

function sort (data, sortInstructions) {
  if (Object.keys(sortInstructions).length !== 1) {
    throw new Error('Only one key-value pair allowed')
  }

  let variable = Object.keys(sortInstructions)[0]
  let sortMethod = sortInstructions[variable]

  let dataType = getDataType(data[variable][0])

  let sortFunc
  if (sortMethod.constructor === String) {
    sortFunc = sortFuncs[dataType][sortMethod]
  }
  if (sortMethod.constructor === Function) {
    sortFunc = sortMethod
  }

  let column = data[variable]

  let indices = column.map((v, i) => i)
  let sortedIndices = indices.sort((a, b) => sortFunc(column[a], column[b]))

  for (let colName in data) {
    data[colName] = reorder(data[colName], sortedIndices)
  }
}

function reorder (column, indices) {
  return indices.map(i => column[i])
}
