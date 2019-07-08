export default function (data) {
  checkIfDataIsEmpty(data)
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

function checkIfDataIsEmpty (data) {
  if (data.length === 0) {
    throw new Error('Received empty Array while trying to load row-oriented data. This is not allowed.')
  }
}
