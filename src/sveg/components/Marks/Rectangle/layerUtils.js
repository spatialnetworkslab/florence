export function getNRectangles (coordinates) {
  let length

  for (let key in coordinates) {
    let coordinateValue = coordinates[key]
    if (!coordinateValue) throw invalidFormatError

    if (coordinateValue.constructor === Array) {
      length = length || coordinateValue.length

      if (length !== coordinateValue.length) throw invalidFormatError
    }
  }

  return length || 1
}

const invalidFormatError = new Error('RectangleLayer: invalid coordinate specification')
