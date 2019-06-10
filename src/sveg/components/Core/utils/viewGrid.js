export function printGrid (rowSizes, colSizes) {
	let layout = ''
	let firstRow = ''
	let genericRow = ''
	let genericCol = ''
	let colWidth
	let rowHeight

	for (let i of colSizes) {
		colWidth = i.x2 - i.x1

		let value = Math.round(colWidth).toString() + 'px'
		let valueLength = value.length
		let placeHolder = new Array(valueLength + 1).join( '-' )
		let placeHolderEmpty = new Array(valueLength + 1).join( ' ' )

		firstRow = firstRow + '-- ' + value + ' --|'
		genericRow = genericRow + '---' + placeHolder + '---|'
		genericCol = genericCol + '   ' + placeHolderEmpty + '   |'
	}

	layout = firstRow + '\n'

	for (let j of rowSizes) {
		rowHeight = j.y2 - j.y1

		let value = Math.round(rowHeight).toString() + 'px'
		let valueLength = value.length

		let emptyCol = genericCol.substring(1) + '\n'
		let valueCol = genericCol.substring(valueLength) + '\n'

		layout = layout + '|' + emptyCol + value + valueCol + '|' + emptyCol + genericRow + '\n'
	}
	
	console.log(layout)
}
