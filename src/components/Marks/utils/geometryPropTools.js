import { isDefined, isUndefined } from '../../../utils/equals.js'

export function ensureValidGeometryProps ({ x, y, geometry }, markType) {
  if (isDefined(x) && isDefined(y) && isUndefined(geometry)) return

  if (isUndefined(x) && isUndefined(y) && isDefined(geometry)) return

  throw new Error(`${markType}: Invalid combination of 'x', 'y', and 'geometry' props`)
}

export function getInputType ({ x, y, geometry }) {
  if (isUndefined(geometry)) return 'xyArrays'
  if (isDefined(geometry)) return 'geometry'
}
