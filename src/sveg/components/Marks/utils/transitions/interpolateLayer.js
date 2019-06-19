import { interpolate } from 'd3-interpolate'

export function interpolateLayer (a, b) {
  let aWithoutObsoleteIndices = {}

  for (let index in a) {
    if (b.hasOwnProperty(index)) {
      aWithoutObsoleteIndices[index] = a[index]
    }
  }

  return interpolate(aWithoutObsoleteIndices, b)
}
