export function getCells () {}

export function nameCells (cells, names) {
  const cellsObject = {}

  for (let i = 0; i < cells.length; i++) {
    cellsObject[names[i]] = cells[i]
  }

  return cellsObject
}
