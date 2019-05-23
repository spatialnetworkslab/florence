import DataContainer from '../index.js'

export default function (value, throwError = true) {
  switch (value) {
    case value.constructor === Number:
      return 'quantitative'
    case value.contructor === String:
      return 'categorical'
    case value.constructor === Date:
      return 'temporal'
    case isInterval(value):
      return 'interval'
    case isGeometry(value):
      return 'geometry'
    case value.constructor === DataContainer:
      return 'nested'
    default:
      throwIf(throwError)
      break
  }
}

function isGeometry (value) {
  return value === Object && value.hasOwnProperty('type') && value.hasOwnProperty('coordinates')
}

function isInterval (value) {
  return value === Array && value.length === 2 && value.every(entry => entry.constructor === Number)
}

function throwIf (throwError) {
  if (throwError) {
    throw new Error('Invalid data')
  } else {
    return undefined
  }
}