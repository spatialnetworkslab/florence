export function isColumnOriented (data) {
  if (data.constructor === Object) {
    let columns = Object.keys(data).map(key => data[key])
    return columns.every(column => column.constructor === Array)
  }

  return false
}

export function isRowOriented (data) {
  if (data.constructor === Array) {
    return data.every(row => row.constructor === Object)
  }

  return false
}

export function isGeoJSON (data) {
  return data.hasOwnProperty('data') && data.type === 'FeatureCollection'
}

export function checkFormatColumnDataframe (data) {
  checkFormat(data, checkRegularColumnName)
}

export function checkFormatTransformableDataContainer (data) {
  checkFormat(data._data, checkTransformedDataColumnName)
}

function checkFormat (data, columnNameChecker) {
  let dataLength = null

  for (let columnName in data) {
    columnNameChecker(columnName)
    let column = data[columnName]

    dataLength = dataLength || column.length

    if (dataLength !== column.length) {
      throw new Error('Invalid data: columns must be of same length')
    }
  }
}

export function checkRegularColumnName (columnName) {
  if (columnName.match(forbiddenChars)) {
    throw new Error(`Invalid column name '${columnName}': '.', '#', '/' and '$' are not allowed'`)
  }
}

const forbiddenChars = /[.#/$]/

export function checkTransformedDataColumnName (columnName) {
  if (!['$index', '$geometry', '$grouped'].includes(columnName)) {
    checkRegularColumnName(columnName)
  }
}
