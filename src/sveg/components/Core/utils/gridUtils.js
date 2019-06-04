export function getRowCells ( specs, ranges ) {
	let cells

	if (specs.constructor === String) {
		// include string parsing logic here
	} else if (specs.constructor === Array) {
		cells = specs
	}

	let numCells = cells.length

	let stepX = (ranges.x2 - ranges.x1)/numCells

	let cellSpecs = []

	if (numCells > 1) {
		for (let i = 0; i < numCells; i++) {
			cellSpecs.push({x1: i * stepX + ranges.x1,
      								x2: (i + 1) * stepX + ranges.x1,
      								y1: ranges.y1,
      								y2: ranges.y2})
      }
	}

	return cellSpecs
}

export function getColCells ( specs, ranges ) {
	let cells

	if (specs.constructor === String) {
		// include string parsing logic here
	} else if (specs.constructor === Array) {
		cells = specs
	}

	let numCells = cells.length

	let stepY = (ranges.y2 - ranges.y1)/numCells

	let cellSpecs = []

	if (numCells > 1) {
		for (let i = 0; i < numCells; i++) {
			cellSpecs.push({y1: i * stepY  + ranges.y1,
      								y2: (i + 1) * stepY  + ranges.y1,
      								x1: ranges.x1,
      								x2: ranges.x2})
      }
	}

	return cellSpecs
}

export function getNames ( names ) {
	let cellNames

	if (names.constructor === String) {
		// include string parsing logic here
	} else if (names.constructor === Array) {
		cellNames = names
	}

	return cellNames
}

export function mergeNameSpecs ( cellNames, cellSpecs ) {
	let namesLength = cellNames.length
	let specsLength = cellSpecs.length

	if (namesLength < specsLength) {
		console.warn('Cell names do not match up with number of cells specified, this may cause errors in your chart.')
		
		for (let i = 0; i < specsLength; i++) {
			if (namesLength[i]) {
				continue
			} else {
				cellNames.push(i)
			}
		}
	} else if (namesLength > specsLength) {
		console.warn('Cell names do not match up with number of cells specified, this may cause errors in your chart.')
	}

	let allSpecs = {}

	// Some logic for merging cells
	for (let j = 0; j < specsLength; j++) {
		let cellName = cellNames[j]

		if (!(cellName in allSpecs)) {
			allSpecs[cellName] = cellSpecs[j]
		} else {
			allSpecs[cellName] = cellMerge(cellSpecs[j], allSpecs[cellName])
		}
	}

	return allSpecs
}

function cellMerge ( cell1, cell2 ) {
	if (cell1.x2 !== cell2.x1) {
		console.warn('Repeated cell names may not be adjacent to one another, this may cause errors in your chart.')
	}

	if (cell1.y2 !== cell2.y1) {
		console.warn('Repeated cell names may not be adjacent to one another, this may cause errors in your chart.')
	}

	let newSpecs = {}

	newSpecs.x1 = cell1.x1
	newSpecs.x2 = cell2.x2
	newSpecs.y1 = cell1.y1
	newSpecs.y2 = cell2.y2

	return newSpecs
} 
