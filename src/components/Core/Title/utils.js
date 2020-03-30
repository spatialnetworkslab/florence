// There are three ways of setting the position of the axis, in order of precedence
// 1. vjust with 'bottom', 'center' or 'top'
//      hjust with 'left', 'center', 'right'
// 1.5. vjust and/or hjust with a number (relative position within content of section)
// 3. x, y props with positioning in data coords
// The first two use 'smart defaults' based on the dimensions of the Graphic or Section
// that the Title is contained in

export function isValid (x, y) {
  let validVariables = 0

  for (const value in [x, y]) {
    if (checkValidType(value)) {
      validVariables += 1
    }
  }

  if (validVariables < 2) {
    throw new Error('Couldn\'t construct legend because of invalid x, y inputs.')
  } else if (validVariables === 2 && x === undefined && y === undefined) {
    return false
  }

  return true

  // if (!isNaN(x) && !isNaN(y)) {
  //   return true
  // }

  // if (x !== undefined || y !== undefined) {
  //   throw new Error('Couldn\'t construct title because of invalid x, y inputs.')
  // }

  // return false
}

function checkValidType (value) {
  if (!isNaN(value) || {}.toString.call(value) === '[object Function]' || value === undefined) {
    return true
  }

  return false
}

export function createTitleXCoord (hjust, range, x, offset, flipX) {
  if (x) {
    return x
  }

  const x1 = range[0]
  const x2 = range[1]
  const sectionWidth = Math.abs(x2 - x1)

  let justification

  if (hjust === 'center' || hjust === 'centre') {
    justification = 0.5
  }

  if (hjust === 'left') {
    justification = 0
  }

  if (hjust === 'right') {
    justification = 1
  }

  if (!isNaN(hjust)) {
    justification = hjust
  }

  if (justification === undefined) {
    justification = 0.5
  }

  if (!['left', 'center', 'right'].includes(hjust) && isNaN(hjust)) {
    throw Error('Please specify either `left`, `center`, `right` or a number from 0 to 1 for `hjust`')
  }

  const posX = flipX ? x2 - (sectionWidth * justification + offset) : x1 + (sectionWidth * justification + offset)
  return posX
}

export function createTitleYCoord (vjust, range, y, offset, fontSize, flipY) {
  if (y) {
    return y
  }

  const y1 = range[0]
  const y2 = range[1]
  const sectionHeight = Math.abs(y2 - y1)

  let justification

  if (vjust === 'center') {
    justification = 0.5
  }

  if (vjust === 'bottom') {
    justification = flipY ? fontSize / sectionHeight : 1 - (fontSize / sectionHeight)
  }

  if (vjust === 'top') {
    justification = flipY ? 1 - (fontSize / sectionHeight) : fontSize / sectionHeight
  }

  if (!isNaN(vjust)) {
    justification = vjust
  }

  if (justification === undefined) {
    justification = 0.5
  }

  if (!['center', 'bottom', 'top'].includes(vjust) && isNaN(vjust)) {
    throw Error('Please specify either `top`, `center`, `bottom` or a number for `vjust`')
  }

  // const posY = flipY ? y2 - (sectionHeight * justification + offset) : y1 + sectionHeight * justification + offset
  const posY = y1 + sectionHeight * justification + offset

  return posY
}
