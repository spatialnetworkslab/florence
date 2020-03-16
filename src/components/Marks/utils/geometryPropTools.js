import { isDefined, isUndefined } from '../../../utils/equals.js'

export function ensureValidGeometryProps ({ x, y, geometry }, markType) {
  if (isDefined(x) && isDefined(y) && isUndefined(geometry)) return

  if (isUndefined(x) && isUndefined(y) && isDefined(geometry)) return

  throw new Error(`${markType}: Invalid combination of 'x', 'y', and 'geometry' props`)
}

export function getInputType ({ x, y, geometry }) {
  if (isUndefined(geometry)) return 'xy'
  if (isDefined(geometry)) return 'geometry'
}

export function validateXYProps (x, y) {
  if (![Array, Function].includes(x.constructor)) {
    throw new Error('\'x\' prop must be Array or Function')
  }

  if (![Array, Function].includes(y.constructor)) {
    throw new Error('\'y\' prop must be Array or Function')
  }
}

export function validateGeometryProp (geometry) {
  if (![Object, Function].includes(geometry.constructor)) {
    throw new Error('\'geometry\' prop must be Object or Function')
  }
}

export function validateXYPropsLayer (x, y) {
  if (![Array, Function].includes(x.constructor)) {
    throw new Error('\'x\' prop must be Array or Function')
  }

  if (![Array, Function].includes(y.constructor)) {
    throw new Error('\'y\' prop must be Array or Function')
  }
}

export function validateGeometryPropLayer (geometry) {
  if (![Array, Function].includes(geometry.constructor)) {
    throw new Error('\'geometry\' prop must be Array or Function')
  }
}
