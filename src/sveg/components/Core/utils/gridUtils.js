export function getAllCells ( templateRows, templateCols, coords ) {
	let getRows = getRowCells( templateRows, coords )

	let allCells = []

	for (let i of getRows) {
		let rowCols = getColCells( templateCols, i )

		allCells = allCells.concat(rowCols)
	}

	return allCells	
}

export function getColCells ( specs, ranges ) {
	let start = ranges.x1
	let cells = []

	specs = validateGridSpec(specs, 'gridTemplateColumns')

	if (specs.constructor === String) {

		let individualSpecs = specs.split(/\s/)
		let frameStep = getFrameStep( individualSpecs, ranges.x2 - ranges.x1)

		for (let i of individualSpecs) {
			let value = parseInt(i.slice(0, -2))
			if (i.endsWith('px')) {
				cells.push(value)
			} else if (i.endsWith('fr')) {
				cells.push(frameStep * value)
			}
		}

	} else if (specs.constructor === Array) {

		let stepX = (ranges.x2 - ranges.x1)/specs.length
		for (let j of specs) {
			cells.push(stepX)
		}

	} else if (specs.constructor === Number) {

		let stepX = (ranges.x2 - ranges.x1)/specs
		for (let k = 0; k < specs; k++) {
			cells.push(stepX)
		}

	}

	let numCells = cells.length

	let cellSpecs = []

	for (let i = 0; i < numCells; i++) {
		cellSpecs.push({x1: start,
    								x2: start + cells[i],
    								y1: ranges.y1,
    								y2: ranges.y2})
		start = start + cells[i]
   }

	return cellSpecs
}

export function getRowCells ( specs, ranges ) {
	let start = ranges.y1
	let cells = []

	specs = validateGridSpec(specs, 'gridTemplateColumns')

	if (specs.constructor === String) {

		let individualSpecs = specs.split(/\s/)
		let frameStep = getFrameStep( individualSpecs, ranges.y2 - ranges.y1)

		for (let i of individualSpecs) {
			if (i.endsWith('px')) {
				cells.push(parseInt(i.slice(0, -2)))
			} else if (i.endsWith('fr')) {
				cells.push(frameStep * parseInt(i.slice(0, -2)))
			}
		}

	} else if (specs.constructor === Array) {

		let stepY = (ranges.y2 - ranges.y1)/specs.length
		for (let j of specs) {
			cells.push(stepY)
		}

	} else if (specs.constructor === Number) {

		let stepY = (ranges.y2 - ranges.y1)/specs
		for (let k = 0; k < specs; k++) {
			cells.push(stepY)
		}

	}

	let numCells = cells.length

	let cellSpecs = []

	for (let i = 0; i < numCells; i++) {
		cellSpecs.push({y1: start,
    								y2: start + cells[i],
    								x1: ranges.x1,
    								x2: ranges.x2})
		start = start + cells[i]
  }

	return cellSpecs
}

export function getNames ( names ) {
	let cellNames

	if (names.constructor === String) {
		let rowNames = names.split('\n')
		let cellsInRow = rowNames.split(/\s/)
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

		if (cellName === undefined) {
			allSpecs[j] = cellSpecs[j]
		} else if (!(cellName in allSpecs)) {
			allSpecs[cellName] = cellSpecs[j]
		} else {
			allSpecs[cellName] = cellMerge(allSpecs[cellName], cellSpecs[j])
		}
	}

	return allSpecs
}

function getFrameStep ( specs, range ) {
	let frameCount = 0

	for (let i of specs) {

		let value = parseInt(i.slice(0, -2))

		if (i.endsWith('px')) {
			range = range - value
		} else if (i.endsWith('fr')) {
			frameCount = frameCount + value
		} else {
			console.warn(`Grid cell size should be specified in -px or -fr. Ignoring input ${i}`)
		}
	}

	if (frameCount === 0) { return 0 }

	return range/frameCount
}

function cellMerge ( cell1, cell2 ) {
	if (cell1.x2 !== cell2.x1 && cell1.y2 !== cell2.y1) {
		console.warn('Repeated cell names may not be adjacent to one another, this may cause errors in your chart.')
	}

	let newSpecs = {}

	newSpecs.x1 = cell1.x1
	newSpecs.x2 = cell2.x2
	newSpecs.y1 = cell1.y1
	newSpecs.y2 = cell2.y2

	return newSpecs
}

function validateGridSpec ( a, direction ) {
	if (a.constructor === String && a === '') {
		console.warn(`Please specify at least one cell in ${direction}. Automatically adding 1 cell to ${direction}.`)
		return '1fr'
	}

	if (a.constructor === Number && a === 0) {
		console.warn(`Please specify at least one cell in ${direction}.`)
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
