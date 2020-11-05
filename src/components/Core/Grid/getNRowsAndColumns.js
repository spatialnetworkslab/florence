export function getAspectRatio ({ x1, x2, y1, y2 }) {
  return Math.abs(x2 - x1) / Math.abs(y2 - y1)
}

export function getNRowsAndColumns (rows, columns, numberOfCells, aspectRatio) {
  if (!rows && !columns) {
    return getNRowsAndColumnsFromAspectRatio(numberOfCells, aspectRatio)
  }
}

function getNRowsAndColumnsFromAspectRatio (numberOfCells, aspectRatio) {
  const sqrtNumberOfCells = Math.ceil(Math.sqrt(numberOfCells))
  const factors = {}

  for (let factor1 = 1; factor1 < sqrtNumberOfCells; factor1++) {
    if (numberOfCells % factor1 === 0) {
      const factor2 = numberOfCells / factor1
      const factorRatio = factor1 / factor2
      const delta = aspectRatio - factorRatio
    }
  }
}
