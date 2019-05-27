export default function (data) {
  let columnData = initColumnData(data)

  for (let row of data) {
    for (let key in row) {
      columnData[key].push(row[key])
    }
  }

  return columnData
}

function initColumnData (data) {
  let firstRow = data[0]
  let columnKeys = Object.keys(firstRow)
  let columnData = {}

  for (let key of columnKeys) {
    columnData[key] = []
  }

  return columnData
}
