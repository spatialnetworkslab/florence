import createPixelGeometryPoint from '../Point/createPixelGeometry.js'
import { createScaledGeometry as createSquareGeometry } from '../Rectangle/createPixelGeometry.js'
import geometryAlias from './geometryAlias.js'
import { transformGeometry } from '../../../utils/geometryUtils'
import { representPointAsPolygon } from '../Point/representPointAsPolygon.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  renderSettings
) {
  const pointGeometry = createPixelGeometryPoint(
    geometryProps,
    sectionContext,
    renderSettings
  )

  const symbolGeometry = createSymbolGeometry(pointGeometry, geometryProps)

  return symbolGeometry
}

export function createSymbolGeometry (pointGeometry, geometryProps) {
  const [cx, cy] = pointGeometry.coordinates

  const shape = geometryProps.shape || 'circle'
  const size = geometryProps.size || 8

  if (shape === 'circle') {
    return createPoint(cx, cy, size)
  }

  if (shape === 'square') {
    return createSquare(cx, cy, size)
  }

  if (shape in geometryAlias) {
    const coordinates = [geometryAlias[shape]]
    const geometry = {
      type: 'Polygon',
      coordinates
    }

    return createSymbolFromGeometry(cx, cy, geometry, size)
  }

  return createSymbolFromGeometry(cx, cy, shape, size)
}

function createPoint (cx, cy, size) {
  const radius = size / 2
  const pointGeometry = {
    type: 'Point',
    coordinates: [cx, cy]
  }
  return representPointAsPolygon(pointGeometry, { radius })
}

function createSquare (cx, cy, size) {
  const halfSize = size / 2

  const x1 = cx - halfSize
  const x2 = cx + halfSize
  const y1 = cy - halfSize
  const y2 = cy + halfSize

  return createSquareGeometry({ x1, x2, y1, y2 })
}

function createSymbolFromGeometry (cx, cy, geometry, size) {
  const halfSize = size / 2
  const transformation = p => [p[0] * halfSize + cx, p[1] * halfSize + cy]

  return transformGeometry(geometry, transformation)
}
