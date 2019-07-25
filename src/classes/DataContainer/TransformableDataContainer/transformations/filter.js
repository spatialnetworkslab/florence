import getDataLength from '../../utils/getDataLength.js'

export default function (data, filterFunction) {
  let length = getDataLength(data)

  let i = length

  while (i--) {
    let row = {}
    for (let colName in data) { row[colName] = data[colName][i] }

    if (!filterFunction(row, i)) {
      for (let colName in data) {
        data[colName].splice(i, 1)
      }
    }
  }
}
