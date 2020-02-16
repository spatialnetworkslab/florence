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

export function validateXYProps (x, y) {
  if (![Array, Function].includes(x)) {
    throw new Error('\'x\' prop must be Array of Function')
  }

  if (![Array, Function].includes(y)) {
    throw new Error('\'y\' prop must be Array of Function')
  }
}

export function validateGeometryProp (geometry) {
  if (![Object, Function].includes(geometry)) {
    throw new Error('\'geometry\' prop must be Object of Function')
  }
}

export function validateXYPropsLayer (x, y) {
  if (![Array, Function].includes(x)) {
    throw new Error('\'x\' prop must be Array of Function')
  }

  if (![Array, Function].includes(y)) {
    throw new Error('\'y\' prop must be Array of Function')
  }
}

export function validateGeometryPropLayer (geometry) {
  if (![Array, Function].includes(geometry)) {
    throw new Error('\'geometry\' prop must be Object of Function')
  }
}
