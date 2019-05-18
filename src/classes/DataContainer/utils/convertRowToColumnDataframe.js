export default function (data) {
  let columnDataFrame = initColumnDataframe(data)

  for (let row of data) {
    for (let key in row) {
      columnDataFrame[key].push(row[key])
    }
  }

  return columnDataFrame
}

function initColumnDataframe (data) {
  let firstRow = data[0]
  let columnKeys = Object.keys(firstRow)
  let columnDataFrame = {}

  for (let key of columnKeys) {
    columnDataFrame[key] = []
  }

  return columnDataFrame
}
