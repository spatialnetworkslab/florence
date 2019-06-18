export default function (geometry) {
  switch (geometry.type) {
    case 'LineString':
      return calculateBBoxLineString(geometry.coordinates)
  }
}

function calculateBBoxLineString (coordinates) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (let i = 0; i < coordinates.length; i++) {
    let position = coordinates[i]

    if (position[0] < minX) { minX = position[0] }
    if (position[1] < minY) { minY = position[1] }
    if (position[0] > maxX) { maxX = position[0] }
    if (position[1] > maxY) { maxY = position[1] }
  }
  return { minX, minY, maxX, maxY }
}

// function updateBBox (o, n) {
//   return {
//     minX: o.minX < n.minX ? o.minX : n.minX,
//     minY: o.minY < n.minY ? o.minY : n.minY,
//     maxX: o.maxX > n.maxX ? o.maxX : n.maxX,
//     maxY: o.maxY > n.maxY ? o.maxY : n.maxY
//   }
// }
