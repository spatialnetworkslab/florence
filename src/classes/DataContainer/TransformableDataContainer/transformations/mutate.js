import getDataLength from '../../utils/getDataLength.js'

export function mutate (data, mutateInstructions) {
  let length = getDataLength(data)

  for (let key in mutateInstructions) {
    data[key] = new Array(length)
  }

  for (let i = 0; i < length; i++) {
    let row = {}
    let prevRow = {}
    let nextRow = {}

    for (let colName in data) {
      row[colName] = data[colName][i]
      prevRow[colName] = data[colName][i - 1]
      nextRow[colName] = data[colName][i + 1]
    }

    if (i === 0) { prevRow = undefined }
    if (i === length - 1) { nextRow = undefined }

    for (let key in mutateInstructions) {
      let mutateFunction = mutateInstructions[key]
      data[key][i] = mutateFunction(row, i, prevRow, nextRow)
    }
  }
}

export function transmute (data, mutateObj) {
  data = mutate(data, mutateObj)

  for (let key in data) {
    if (!mutateObj.hasOwnProperty(key)) {
      delete data[key]
    }
  }
}
