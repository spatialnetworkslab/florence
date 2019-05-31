export function round (value, decimals = 2) {
  const multiplier = 10 ** decimals
  return Math.floor(value * multiplier) / multiplier
}

export function roundPoint (point, decimals = 2) {
  return point.map(c => round(c, decimals))
}

export function roundPointArray (array, decimals = 2) {
  return array.map(point => roundPoint(point, decimals))
}
