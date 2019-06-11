import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolateLayer } from './interpolateLayer.js'
import { transitionGeometryLayer } from './geometry'

export function createTransitionableLayer (aestheticName, aestheticValue, transitionOptions, geometryType) {
  if (transitionOptions === undefined) {
    return writable(aestheticValue)
  }

  if (transitionOptions.constructor === Number) {
    let options = createOptionsFromDuration(aestheticName, transitionOptions, geometryType)
    return tweened(aestheticValue, options)
  }

  if (transitionOptions.constructor === Object) {
    if (!transitionOptions.hasOwnProperty(aestheticName)) return writable(aestheticValue)

    let aestheticTransition = transitionOptions[aestheticName]

    if (aestheticTransition && aestheticTransition.constructor === Number) {
      let options = createOptionsFromDuration(aestheticName, aestheticTransition, geometryType)
      return tweened(aestheticValue, options)
    }

    if (aestheticTransition && aestheticTransition.constructor === Object) {
      let options = createOptionsFromOptions(aestheticName, aestheticTransition, geometryType)
      return tweened(aestheticValue, options)
    }
  }

  throw new Error(`Invalid transition for ${aestheticName}`)
}

function createOptionsFromDuration (aestheticName, duration, geometryType) {
  switch (aestheticName) {
    case 'coordinates':
      return { duration, easing: cubicOut, interpolate: transitionGeometryLayer[geometryType] }

    case 'geometry':
      return { duration, easing: cubicOut, interpolate: transitionGeometryLayer[geometryType] }

    default:
      return { duration, easing: cubicOut, interpolate: interpolateLayer }
  }
}

function createOptionsFromOptions (aestheticName, transitionOptions, geometryType) {
  switch (aestheticName) {
    case 'coordinates':
      return Object.assign({ interpolate: transitionGeometryLayer[geometryType] }, transitionOptions)

    case 'geometry':
      return Object.assign({ interpolate: transitionGeometryLayer[geometryType] }, transitionOptions)

    default:
      return Object.assign({ interpolate: interpolateLayer }, transitionOptions)
  }
}
