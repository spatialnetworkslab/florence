// Gets all cells in grid in format { areaName: {x1, x2, y1, y2}, ... }
// given the template specs and definition
export function getAllCells (templateRows, templateCols, rowGap, colGap, coords) {
  let numCols

  // Divide svg into rows first
  const getRows = getRowCells(templateRows, rowGap, coords)
  const numRows = getRows.length

  let colSizes = []
  const rowSizes = []

  let allCells = []

  // Divide each row into columns
  // Practically speaking, it doesn't make a difference
  // which comes first
  for (const i of getRows) {
    const rowCols = getColCells(templateCols, colGap, i)

    allCells = allCells.concat(rowCols)

    rowSizes.push(i)
    colSizes = rowCols

    numCols = rowCols.length
  }

  return [allCells, rowSizes, colSizes, numRows, numCols]
}

// Divides each row into columns
export function getColCells (specs, colGap, ranges) {
  let start = ranges.x1
  const cells = []

  specs = validateGridSpec(specs, 'gridTemplateColumns')

  if (specs.constructor === String) {
    const individualSpecs = specs.split(/\s/)
    const frameStep = getFrameStep(individualSpecs, ranges.x2 - ranges.x1)

    for (const i of individualSpecs) {
      const value = parseInt(i.slice(0, -2))
      if (i.endsWith('px')) {
        cells.push(value)
      } else if (i.endsWith('fr')) {
        cells.push(frameStep * value)
      }
    }
  } else if (specs.constructor === Array) {
    const stepX = (ranges.x2 - ranges.x1) / specs.length

    for (let j = 0; j < specs.length; j++) {
      cells.push(stepX)
    }
  } else if (specs.constructor === Number) {
    const stepX = (ranges.x2 - ranges.x1) / specs

    for (let k = 0; k < specs; k++) {
      cells.push(stepX)
    }
  }

  const numCells = cells.length

  const cellSpecs = []

  for (let i = 0; i < numCells; i++) {
    cellSpecs.push({
      x1: start,
      x2: start + cells[i] - colGap / 2,
      y1: ranges.y1,
      y2: ranges.y2
    })

    start = start + cells[i] + colGap / 2
  }

  return cellSpecs
}

// Divides each column into rows
// Logic should probably be refactored since this function
// is similar to getColCells
export function getRowCells (specs, rowGap, ranges) {
  let start = ranges.y1
  const cells = []

  specs = validateGridSpec(specs, 'gridTemplateColumns')

  if (specs.constructor === String) {
    const individualSpecs = specs.split(/\s/)
    const frameStep = getFrameStep(individualSpecs, ranges.y2 - ranges.y1)

    for (const i of individualSpecs) {
      if (i.endsWith('px')) {
        cells.push(parseInt(i.slice(0, -2)))
      } else if (i.endsWith('fr')) {
        cells.push(frameStep * parseInt(i.slice(0, -2)))
      }
    }
  } else if (specs.constructor === Array) {
    const stepY = (ranges.y2 - ranges.y1) / specs.length

    for (let j = 0; j < specs.length; j++) {
      cells.push(stepY)
    }
  } else if (specs.constructor === Number) {
    const stepY = (ranges.y2 - ranges.y1) / specs

    for (let k = 0; k < specs; k++) {
      cells.push(stepY)
    }
  }

  const numCells = cells.length

  const cellSpecs = []

  for (let i = 0; i < numCells; i++) {
    cellSpecs.push({
      y1: start,
      y2: start + cells[i] - rowGap / 2,
      x1: ranges.x1,
      x2: ranges.x2
    })

    start = start + cells[i] + rowGap / 2
  }

  return cellSpecs
}

// If 'fr' definition is used, get the size of 1fr
// Allows for mixed definitions, e.g. 150px 1fr 2fr
function getFrameStep (specs, range) {
  let frameCount = 0

  for (const i of specs) {
    const value = parseInt(i.slice(0, -2))

    if (i.endsWith('px')) {
      range = range - value
    } else if (i.endsWith('fr')) {
      frameCount = frameCount + value
    } else {
      console.warn(`Grid cell size should be specified in -px or -fr. Ignoring input ${i}`)
    }
  }

  if (frameCount === 0) { return 0 }

  return range / frameCount
}

// Adjacent cells with the same name are merged into a single area
export function mergeNameSpecs (cellNames, cellSpecs, numCols) {
  const namesLength = cellNames.length
  const specsLength = cellSpecs.length

  if (namesLength < specsLength) {
    console.warn('Cell names do not match up with number of cells specified, this may cause errors in your chart.')

    // Nameless cells are given their index as names
    for (let i = 0; i < specsLength; i++) {
      if (cellNames[i]) continue
      else { cellNames.push(i) }
    }
  } else if (namesLength > specsLength) {
    console.warn('Cell names do not match up with number of cells specified, this may cause errors in your chart.')
  }

  const allSpecs = {}
  const cellStartEnd = {}

  // Some logic for merging cells
  for (let j = 0; j < specsLength; j++) {
    const cellName = cellNames[j]

    if (cellName === undefined) {
      allSpecs[j] = cellSpecs[j]
    } else if (!(cellName in allSpecs)) {
      allSpecs[cellName] = cellSpecs[j]
      cellStartEnd[cellName] = { startRow: Math.floor(j / numCols), startCol: j % numCols, endRow: Math.floor(j / numCols), endCol: j % numCols }
    } else {
      allSpecs[cellName] = cellMerge(cellName, allSpecs[cellName], cellSpecs[j])

      const newRow = Math.floor(j / numCols)
      const newCol = j % numCols

      const currentRow = cellStartEnd[cellName].endRow
      const currentCol = cellStartEnd[cellName].endCol

      cellStartEnd[cellName].endRow = newRow > currentRow ? newRow : currentRow
      cellStartEnd[cellName].endCol = newCol > currentCol ? newCol : currentCol
    }
  }

  // Check that grid areas are rectangular
  validateCellSpaces(cellStartEnd, cellNames, numCols)

  return allSpecs
}

// This function is intentionally quite dumb so that incorrect specs
// do not crash the graph but cause visibly incorrect rendering
function cellMerge (cellName, cell1, cell2) {
  const newSpecs = {}

  newSpecs.x1 = cell1.x1 < cell2.x1 ? cell1.x1 : cell2.x1
  newSpecs.x2 = cell1.x2 > cell2.x2 ? cell1.x2 : cell2.x2
  newSpecs.y1 = cell1.y1 < cell2.y1 ? cell1.y1 : cell2.y1
  newSpecs.y2 = cell1.y2 > cell2.y2 ? cell1.y2 : cell2.y2

  return newSpecs
}

// Checks that gridTemplateRows and gridTemplateAreas are defined
function validateGridSpec (a, direction) {
  if (a.constructor === String && a === '') {
    console.warn(`Please specify at least one cell in ${direction}. Automatically adding 1 cell to ${direction}.`)
    return '1fr'
  }

  if (a.constructor === Number && a === 0) {
    console.warn(`Please specify at least one cell in ${direction}. Automatically adding 1 cell to ${direction}.`)
    return 1
  } else if (a.constructor === Number && (a % 1) !== 0) {
    console.warn(`Please specify ${direction} with integers only. Using rounded value ${Math.ceil(a)}.`)
    return Math.ceil(a)
  }

  if (a.constructor === Array && a.length === 0) {
    console.warn(`Please specify at least one cell in ${direction}. Automatically adding 1 cell to ${direction}.`)
    return [0]
  }

  if ([Array, Number, String].indexOf(a.constructor) === -1) {
    console.warn(`Please specify ${direction} with Number, String or Array. Assuming 1 cell specified.`)
    return 1
  }

  return a
}

// Checks that grid areas are rectangular
// This function is quite inefficient, can be optimized at a later date
// Only console warnings are issued, the graph is still rendered (but incorrectly)
function validateCellSpaces (spaces, indvCells, numCols) {
  for (const areaName in spaces) {
    const area = spaces[areaName]

    const startRow = area.startRow
    const startCol = area.startCol
    const endRow = area.endRow
    const endCol = area.endCol

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const index = r * numCols + c
        if (indvCells[index] !== areaName) {
          console.warn(`Area ${areaName} may not be rectangular in prop gridTemplateAreas, this can cause errors in your chart.`)
        }
      }
    }
  }
}
