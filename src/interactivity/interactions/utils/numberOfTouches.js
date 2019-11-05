export default function numberOfTouches (nativeEvent) {
  if (nativeEvent.constructor === Object) return 1

  return nativeEvent.length
}
