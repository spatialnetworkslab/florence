import generatePath from '../../Marks/utils/generatePath.js'

export function createBaseLinePathXAxis (y, { paddedBbox }) {
  const { x1, x2 } = paddedBbox

  return generatePath({
    type: 'Line',
    coordinates: [
      [x1, y], [x2, y]
    ]
  })
}

export function createBaseLinePathYAxis (x, { paddedBbox }) {
  const { y1, y2 } = paddedBbox

  return generatePath({
    type: 'Line',
    coordinates: [
      [x, y1], [x, y2]
    ]
  })
}
