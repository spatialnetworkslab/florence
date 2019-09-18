export function hitIsInsideSection (hit, section) {
  return (
    hit.x >= section.minX &&
    hit.x <= section.maxX &&
    hit.y >= section.minY &&
    hit.y <= section.maxY
  )
}

export function hitIsMark (hit) {
  return 'markId' in hit
}

export function hitIsInLayer (hit) {
  return 'layerId' in hit
}
