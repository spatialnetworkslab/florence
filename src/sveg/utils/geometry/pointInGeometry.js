export default function (point, geometry) {
  switch (geometry.type) {
    case 'LineString':
      return pointInLineString(point, geometry.coordinates)
  }
}

function pointInLineString (point, coordinates) {
  let x = point[0]
  let y = point[1]
  let inside = false

  for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    let xi = coordinates[i][0]
    let yi = coordinates[i][1]
    let xj = coordinates[j][0]
    let yj = coordinates[j][1]
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) { inside = !inside }
  }

  return inside
}
