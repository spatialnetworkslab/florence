export function coordinatesAreInsideSection (hit, section) {
  const bbox = section.bbox

  return (
    hit.x >= bbox.minX &&
    hit.x <= bbox.maxX &&
    hit.y >= bbox.minY &&
    hit.y <= bbox.maxY
  )
}

export function hitIsMark (hit) {
  return 'markId' in hit
}

export function hitIsInLayer (hit) {
  return 'layerId' in hit
}

export function getHitId (hit) {
  if (hitIsMark(hit)) return hit.markId
  if (hitIsInLayer(hit)) return hit.layerId + '-' + hit.key
}
