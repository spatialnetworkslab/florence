import DataContainer from '../index.js'

export default function (value, throwError = true) {
  if (value.constructor === Number) return 'quantitative'
  if (value.constructor === String) return 'categorical'
  if (value.constructor === Date) return 'temporal'
  if (isInterval(value)) return 'interval'
  if (isGeometry(value)) return 'geometry'
  if (value.constructor === DataContainer) return 'nested'

  throwIf(throwError)
}

function isGeometry (value) {
  return value.constructor === Object && value.hasOwnProperty('type') && value.hasOwnProperty('coordinates')
}

function isInterval (value) {
  return value.constructor === Array && value.length === 2 && value.every(entry => entry.constructor === Number)
}

function throwIf (throwError) {
  if (throwError) {
    throw new Error('Invalid data')
  } else {
    return undefined
  }
}
