export default function numberOfTouches (screenCoordinates) {
  if (screenCoordinates.constructor === Object) return 1

  return screenCoordinates.length
}
