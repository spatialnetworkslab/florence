import generatePath from '../../Marks/utils/generatePath.js'

export function createBaseLineXPath (vjust, yOffset, { paddedBbox }) {
  const { x1, x2, y1, y2 } = paddedBbox

  let y

  if (vjust === 'top') {
    y = y1 - yOffset
  }

  if (vjust === 'bottom') {
    y = y2 + yOffset
  }

  if (['center', 'centre'].includes(vjust)) {
    y = (y2 - y1) / 2 + y1 + yOffset
  }

  if (vjust.constructor === Number) {
    y = (y2 - y1) * vjust + y1
  }

  return generatePath({
    type: 'Line',
    coordinates: [
      [x1, y], [x2, y]
    ]
  })
}

export function createBaseLineYPath (hjust, xOffset, { paddedBbox }) {
  const { x1, x2, y1, y2 } = paddedBbox

  let x

  if (hjust === 'left') {
    x = x1 - xOffset
  }

  if (hjust === 'right') {
    x = x2 + xOffset
  }

  if (['center', 'centre'].includes(hjust)) {
    x = (x2 - x1) / 2 + x1 + xOffset
  }

  if (hjust.constructor === Number) {
    x = (x2 - x1) * hjust + y1
  }

  return generatePath({
    type: 'Line',
    coordinates: [
      [x, y1], [x, y2]
    ]
  })
}
