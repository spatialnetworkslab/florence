export function getNPoints (coordinates) {
  ensureValidFormat(coordinates)

  return coordinates.x1.length
}

function ensureValidFormat (coordinates) {
  let length

  for (let key in coordinates) {
    let coordinateValue = coordinates[key]
    if (coordinateValue.constructor !== Array) throw invalidFormatError

    length = length || coordinateValue.length

    if (length !== coordinateValue.length) throw invalidFormatError
  }
}

const invalidFormatError = new Error('RectangleLayer: invalid coordinate specification')