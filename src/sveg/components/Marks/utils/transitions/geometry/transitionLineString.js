import { interpolate } from 'd3-interpolate'
import processPoints from './helpers/processPoints.js'

export function transitionLineString (a, b, excludeSegment) {
  let [aProcessed, bProcessed] = processPoints(a, b, excludeSegment)

  // use d3's interpolator to now interpolate between two processed point arrays.
  const interpolator = interpolate(aProcessed, bProcessed)

  return function transitionPoints (t) {
    // at 1 return the final value without the extensions used during interpolation
    if (t === 1) {
      return b == null ? [] : b
    }

    return interpolator(t)
  }
}

// export function transitionLineStringLayer (a, b, excludeSegment) {
//   let aLayerProcessed = []
//   let bLayerProcessed = []

//   for (let i = 0; i < )
// }
