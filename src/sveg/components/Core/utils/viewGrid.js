export function printGrid (rowSizes, colSizes) {
	let layout = ''
	let genericRow = ''
	let colWidth
	let rowHeight

	for (let i of colSizes) {
		colWidth = i.x2 - i.x1

		genericRow = genericRow + '-- ' + Math.round(colWidth).toString() + 'px --|'
	}

	layout = genericRow + '\n'

	for (let j of rowSizes) {
		rowHeight = j.y2 - j.y1

		layout = layout + '|\n' + Math.round(rowHeight).toString() + 'px\n|\n' + genericRow + '\n'
	}
	
	console.log(layout)

}
