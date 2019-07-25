export function linearRingArea (vertices) {
  return Math.abs(signedLinearRingArea(vertices))
}

function signedLinearRingArea (vertices) {
  let total = 0

  for (let i = 0, l = vertices.length; i < l; i++) {
    const addX = vertices[i][0]
    const addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1]
    const subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0]
    const subY = vertices[i][1]

    total += (addX * addY * 0.5)
    total -= (subX * subY * 0.5)
  }

  return total
}

export function linearRingIsClockwise (vertices) {
  return signedLinearRingArea(vertices) < 0
}
