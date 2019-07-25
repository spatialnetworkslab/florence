export function printGrid (rowSizes, colSizes) {
  let layout = ''
  let firstRow = ''
  let genericRow = ''
  let genericCol = ''
  let colWidth
  let rowHeight

  for (const i of colSizes) {
    colWidth = i.x2 - i.x1

    const value = Math.round(colWidth).toString() + 'px'
    const valueLength = value.length
    const placeHolder = new Array(valueLength + 1).join('-')
    const placeHolderEmpty = new Array(valueLength + 1).join(' ')

    firstRow = firstRow + '-- ' + value + ' --|'
    genericRow = genericRow + '---' + placeHolder + '---|'
    genericCol = genericCol + '   ' + placeHolderEmpty + '   |'
  }

  layout = firstRow + '\n'

  for (const j of rowSizes) {
    rowHeight = j.y2 - j.y1

    const value = Math.round(rowHeight).toString() + 'px'
    const valueLength = value.length

    const emptyCol = genericCol.substring(1) + '\n'
    const valueCol = genericCol.substring(valueLength) + '\n'

    layout = layout + '|' + emptyCol + value + valueCol + '|' + emptyCol + genericRow + '\n'
  }

  console.log(layout)
}
