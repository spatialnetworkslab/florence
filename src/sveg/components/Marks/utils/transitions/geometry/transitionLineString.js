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

export function transitionLineStringLayer (a, b, excludeSegment) {
  let aProcessedLayer = {}
  let bProcessedLayer = {}

  // Make sure that every index that is in a AND b, will be processed for transitioning
  for (let index in a) {
    if (b.hasOwnProperty(index)) {
      let [aProcessed, bProcessed] = processPoints(a[index], b[index], excludeSegment)
      aProcessedLayer[index] = aProcessed
      bProcessedLayer[index] = bProcessed
    }
  }

  // Ignore indices that are only in a, but add ones that are in b but not in a.
  // No need to process these, as these are just exiting/entering instead of transitioning
  for (let index in b) {
    if (!bProcessedLayer.hasOwnProperty(index)) {
      bProcessedLayer[index] = b[index]
    }
  }

  const interpolator = interpolate(aProcessedLayer, bProcessedLayer)

  return function transitionPoints (t) {
    // at 1 return the final value without the extensions used during interpolation
    if (t === 1) {
      return b == null ? [] : b
    }

    return interpolator(t)
  }
}
