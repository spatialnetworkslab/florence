import { mean } from 'd3-array'

export function kernelDensityEstimator (kernel, X) {
  return function (V) {
    return X.map(x => mean(V, v => kernel(x - v)))
  }
}

export function kernelEpanechnikov (k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0
  }
}
