import { parsePadding } from '../utils/padding.js'

export function getCells ({ x1, x2, y1, y2 }, nrows, ncolumns, cellPadding) {
  const cellWidth = (x2 - x1) / ncolumns
  const cellHeight = (y2 - y1) / nrows

  const cells = []

  for (let rowIndex = 0; rowIndex < nrows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < ncolumns; columnIndex++) {
      const cell = {
        x1: x1 + (cellWidth * columnIndex),
        x2: x1 + (cellWidth * (columnIndex + 1)),
        y1: y1 + (cellHeight * rowIndex),
        y2: y1 + (cellHeight * (rowIndex + 1))
      }

      cells.push(applyPadding(cell, cellPadding))
    }
  }

  return cells
}

export function applyPadding ({ x1, x2, y1, y2 }, padding) {
  const { left, right, top, bottom } = parsePadding(padding)

  return {
    x1: x1 < x2 ? x1 + left : x1 - right,
    x2: x1 < x2 ? x2 - right : x2 + left,
    y1: y1 < y2 ? y1 + top : y1 - bottom,
    y2: y1 < y2 ? y2 - bottom : y2 + top
  }
}

export function nameCells (cells, names) {
  const cellsObject = {}

  for (let i = 0; i < cells.length; i++) {
    cellsObject[names[i]] = cells[i]
  }

  return cellsObject
}
