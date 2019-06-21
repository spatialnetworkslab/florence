import { geoPath } from 'd3-geo'

const geoPathGenerator = geoPath()

export default function (geometry) {
  return geoPathGenerator(geometry)
}
