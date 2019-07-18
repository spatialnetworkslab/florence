import generateScreenGeometryPoint from '../Point/generateScreenGeometry.js'
import generateScreenGeometryRectangle from '../Rectangle/generateScreenGeometry.js'
import generateScreenGeometryPolygon from '../Polygon/generateScreenGeometry.js'

const screenGeometryHashTable = {
  Point: generateScreenGeometryPoint,
  Rectangle: generateScreenGeometryRectangle,
  Polygon: generateScreenGeometryPolygon
}

export function generateScreenGeometry (markType) {
  const generateScreenGeometryFunction = screenGeometryHashTable[markType]

  if (!generateScreenGeometryFunction) throw new Error(`Invalid Mark type '${markType}'`)

  return generateScreenGeometryFunction
}

export function ensureValidPropCombination (markType, positioningProps) {

}
