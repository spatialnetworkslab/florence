// https://stackoverflow.com/a/155678/7237112
export function representPointAsPolygon (point, { radius }) {
  const x = point.coordinates[0]
  const y = point.coordinates[1]

  const circumference = Math.PI * 2 * radius
  const steps = Math.max(Math.ceil(circumference), 9)

  const polygon = {
    type: 'Polygon',
    coordinates: [[]]
  }

  for (let i = 0; i < steps; i++) {
    polygon.coordinates[0].push(
      [
        x + radius * Math.cos(Math.PI * i / steps * 2 - Math.PI / 2),
        y + radius * Math.sin(Math.PI * i / steps * 2 - Math.PI / 2)
      ]
    )
  }

  // close polygon
  polygon.coordinates[0].push(polygon.coordinates[0][0])

  return polygon
}

export function representPointsAsPolygons (points, { radiusObject }) {
  const polygons = {}

  for (const key in points) {
    polygons[key] = representPointAsPolygon(points[key], { radius: radiusObject[key] })
  }

  return polygons
}
