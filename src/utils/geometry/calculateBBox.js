export default function (geometryType, geometry) {
  switch (geometryType) {
    case 'LineString':
      return calculateBBoxLineString(geometry)
  }
}

function calculateBBoxLineString (geometry) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let i = 0; i < geometry.length; i++) {
    let position = geometry[i]

    if (position[0] < minX) { minX = position[0] }
    if (position[1] < minY) { minY = position[1] }
    if (position[0] > maxX) { maxX = position[0] }
    if (position[1] > maxY) { maxY = position[1] }
  }
  return { minX, minY, maxX, maxY }
}

// need this for zoom and pan
function updateBBox (o, n) {
  return {
    minX: o.minX < n.minX ? o.minX : n.minX,
    minY: o.minY < n.minY ? o.minY : n.minY,
    maxX: o.maxX > n.maxX ? o.maxX : n.maxX,
    maxY: o.maxY > n.maxY ? o.maxY : n.maxY
  }
}
