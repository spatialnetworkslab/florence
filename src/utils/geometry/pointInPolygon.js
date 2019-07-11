export default function (point, polygon) {
  let x = point[0]
  let y = point[1]
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0]
    let yi = polygon[i][1]
    let xj = polygon[j][0]
    let yj = polygon[j][1]
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) { inside = !inside }
  }

  return inside
}
