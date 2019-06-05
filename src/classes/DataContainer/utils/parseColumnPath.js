export function columnPathIsValid (columnPath, dataContainer) {
  try {
    checkColumnPath(columnPath, dataContainer)
    return true
  } catch (e) {
    return false
  }
}

export function checkColumnPath (columnPath, dataContainer) {
  let columnPathArray = columnPath.split('/')
  parseColumnPath(columnPathArray, dataContainer, columnPath)
}

export function checkIfColumnExists (columnName, dataContainer) {
  if (!dataContainer.data().hasOwnProperty(columnName)) {
    throw new Error(`Invalid column name: '${columnName}'`)
  }
}

export function getColumn (columnPath, dataContainer) {
  let columnPathArray = columnPath.split('/')
  return traverseColumnPath(columnPathArray, dataContainer)
}

export function mapColumn (columnPath, dataContainer, mapFunction) {
  let column = getColumn(columnPath, dataContainer)
  let levels = columnPath.split('/').length
  return mapRecursive(levels, column, mapFunction)
}

function parseColumnPath (columnPathArray, dataContainer, originalPath) {
  let data = dataContainer.data()
  let ownColumnName = columnPathArray[0]
  ensureDataHasColumn(data, ownColumnName, originalPath)

  if (columnPathArray.length > 1) {
    ensureColumnIsGrouped(ownColumnName, originalPath)

    let nestedColumnPathArray = removeFirstElement(columnPathArray)
    let groupedColumn = data.$grouped

    parseColumnPath(nestedColumnPathArray, groupedColumn[0], originalPath)
  }
}

function ensureDataHasColumn (data, columnName, originalPath) {
  if (!data.hasOwnProperty(columnName)) throw columnNotFoundError(columnName, originalPath)
}

function ensureColumnIsGrouped (columnName, originalPath) {
  if (columnName !== '$grouped') throw invalidColumnPathError(originalPath)
}

function removeFirstElement (array) {
  return array.splice(1, array.length - 1)
}

function traverseColumnPath (columnPathArray, dataContainer) {
  let newColumn = []
  let ownColumnName = columnPathArray[0]
  let data = dataContainer.data()

  if (columnPathArray.length === 1) {
    newColumn = data[ownColumnName]
  }

  if (columnPathArray.length > 1) {
    let groupedColumn = data[ownColumnName]
    let nestedColumnPathArray = removeFirstElement(columnPathArray)

    groupedColumn.forEach(groupedContainer => {
      newColumn.push(
        traverseColumnPath(nestedColumnPathArray, groupedContainer)
      )
    })
  }

  return newColumn
}

function mapRecursive (levels, column, mapFunction) {
  if (levels === 1) {
    return column.map(mapFunction)
  } else {
    levels--
    return column.map(nestedColumn => mapRecursive(levels, nestedColumn, mapFunction))
  }
}

const columnNotFoundError = (columnName, originalPath) => {
  return new Error(`Could not find column '${columnName}' while traversing column path '${originalPath}'`)
}
const invalidColumnPathError = columnPath => new Error(`Invalid column path: '${columnPath}`)
