export function getAspectRatio ({ x1, x2, y1, y2 }) {
  return Math.abs(x2 - x1) / Math.abs(y2 - y1)
}

export function getNRowsAndColumns (rows, columns, numberOfCells, aspectRatio) {
  if (!rows && !columns) {
    return getNRowsAndColumnsFromAspectRatio(numberOfCells, aspectRatio)
  }

  if (rows && !columns) {
    return {
      nrows: rows,
      ncolumns: Math.ceil(numberOfCells / rows)
    }
  }

  if (!rows && columns) {
    return {
      nrows: Math.ceil(numberOfCells / columns),
      ncolumns: columns
    }
  }

  return {
    nrows: rows,
    ncolumns: columns
  }
}

function getNRowsAndColumnsFromAspectRatio (numberOfCells, aspectRatio) {
  let ncolumns = 1
  let nrows = 1

  if (aspectRatio > 1) {
    while (ncolumns * nrows < numberOfCells) {
      if ((ncolumns / nrows) < aspectRatio) {
        ncolumns++
      } else {
        nrows++
      }
    }
  }

  if (aspectRatio <= 1) {
    while (ncolumns * nrows < numberOfCells) {
      if ((ncolumns / nrows) > aspectRatio) {
        ncolumns++
      } else {
        nrows++
      }
    }
  }

  return { nrows, ncolumns }
}
