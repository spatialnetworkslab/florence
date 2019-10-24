// There are three ways of setting the position of the axis, in order of precedence
// 1. vjust with 'bottom', 'center' or 'top'
//      hjust with 'left', 'center', 'right'
// 1.5. vjust and/or hjust with a number (relative position within content of section)
// 3. x, y props with positioning in data coords
// The first two use 'smart defaults' based on the dimensions of the Graphic or Section
// that the Title is contained in

export function isValid (x, y) {
  if (!isNaN(x) && !isNaN(y)) {
    return true
  }

  if (x !== undefined || y !== undefined) {
    throw new Error('Couldn\'t construct title because of invalid x, y inputs.')
  }

  return false
}

export function createTitleXCoord (hjust, range, x, offset, fontSize, padding, usePadding) {
  if (x) {
    return x
  }

  let x1 = range[0]
  let x2 = range[1]
  const sectionWidth = Math.abs(x2 - x1)

  // if (usePadding){
  //   x1 = hjust = 'left'
  // }

  let justification
  let addFontSize

  if (hjust === 'center' || hjust === 'centre') {
    justification = 0.5
    addFontSize = 0
  }

  if (hjust === 'left') {
    justification = 0
    addFontSize = fontSize
    x1 = padding !== undefined ? x1 - padding.left / 1.5 : x1
  }

  if (hjust === 'right') {
    justification = 1
    addFontSize = -fontSize
    x1 = padding !== undefined ? x1 + padding.right / 1.5 : x1
  }

  if (!isNaN(hjust)) {
    justification = hjust
    x1 = padding !== undefined ? x1 - padding.left / 1.5 : x1
  }

  if (justification === undefined) {
    justification = 0.5
    addFontSize = 0
    x1 = padding !== undefined ? x1 - padding.left / 1.5 : x1
  }

  if (!['left', 'center', 'right'].includes(hjust) && isNaN(hjust)) {
    throw Error('Please specify either `left`, `center`, `right` or a number from 0 to 1 for `hjust`')
  }

  return x1 + sectionWidth * justification + offset + addFontSize
}

export function createTitleYCoord (vjust, range, y, offset, fontSize, padding, usePadding) {
  if (y) {
    return y
  }

  let y1 = range[0]
  let y2 = range[1]
  const sectionHeight = Math.abs(y2 - y1)

  let justification
  let addFontSize

  if (vjust === 'center') {
    justification = 0.5
    addFontSize = 0
  }

  if (vjust === 'bottom') {
    justification = 1 - (fontSize / sectionHeight)
    addFontSize = fontSize
    y1 = padding !== undefined ? y1 + padding.bottom : y1
  }

  if (vjust === 'top') {
    justification = 0.01
    addFontSize = -fontSize
    y1 = padding !== undefined ? y1 - padding.top - fontSize : y1 - fontSize
  }

  if (!isNaN(vjust)) {
    justification = vjust
    addFontSize = 0
    y1 = padding !== undefined ? y1 + padding.bottom : y1
  }

  if (justification === undefined) {
    justification = 0.5
    addFontSize = 0
    y1 = padding !== undefined ? y1 - padding.top : y1
  }

  if (!['center', 'bottom', 'top'].includes(vjust) && isNaN(vjust)) {
    throw Error('Please specify either `top`, `center`, `bottom` or a number for `vjust`')
  }

  return y1 + sectionHeight * justification + offset - addFontSize
}
