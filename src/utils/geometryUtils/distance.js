export function pointDistance (point1, point2) {
  return Math.sqrt(
    (point1[0] - point2[0]) ** 2 +
    (point1[1] - point2[1]) ** 2
  )
}

export function linearRingLength (linearRing) {
  let totalLength = 0

  for (let i = 0; i < linearRing.length - 1; i++) {
    const from = linearRing[i]
    const to = linearRing[i + 1]

    totalLength += pointDistance(from, to)
  }

  return totalLength
}
