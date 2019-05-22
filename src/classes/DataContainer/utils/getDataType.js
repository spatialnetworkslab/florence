export default function (value, throwError = true) {
  switch (value.constructor) {
    case Number:
      return 'quantitative'
    case String:
      return 'categorical'
    case Date:
      return 'temporal'
    case Object:
      if (value.hasOwnProperty('type') && value.hasOwnProperty('coordinates')) {
        return 'geometry'
      } else {
        throwIf(throwError)
        break
      }
    case Array:
      if (value.length === 2 && value[0].constructor === value[1].constructor) {
        if (value[0].constructor === Number) {
          return 'interval:quantitative'
        } else if (value[0].constructor === Date) {
          return 'interval:temporal'
        } else {
          throwIf(throwError)
          break
        }
      } else {
        throwIf(throwError)
        break
      }
    default:
      throwIf(throwError)
      break
  }
}

function throwIf (throwError) {
  if (throwError) {
    throw new Error('Invalid data')
  } else {
    return undefined
  }
}
