import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolate } from 'd3-interpolate'
import { transitionGeometries } from 'geometryUtils'

/**
 * Like createTransitionable, returns either a Svelte store, or a Svelte 'tweened' store,
 * depending on whether the user specified transition options.
 * But instead of for a single Mark, the store is created for an entire layer.
 *
 * @param {String} aestheticName The name of the aesthetic a store is created for.
 * @param {*} aestheticValue The initial value of the store.
 * @param {Number|Object} transitionOptions A number indicating the transtion duration, or an Object
 * with aesthetic names as keys, and Numbers OR Objects as values.
 * @returns {writable|tweened}
 */
export function createTransitionableLayer (aestheticName, aestheticValue, transitionOptions) {
  if (transitionOptions === undefined) {
    return writable(aestheticValue)
  }

  if (transitionOptions.constructor === Number) {
    const options = createOptionsFromDuration(aestheticName, transitionOptions)
    return tweened(aestheticValue, options)
  }

  if (transitionOptions.constructor === Object) {
    if (!(aestheticName in transitionOptions)) return writable(aestheticValue)

    const aestheticTransition = transitionOptions[aestheticName]

    if (aestheticTransition && aestheticTransition.constructor === Number) {
      const options = createOptionsFromDuration(aestheticName, aestheticTransition)
      return tweened(aestheticValue, options)
    }

    if (aestheticTransition && aestheticTransition.constructor === Object) {
      const options = createOptionsFromOptions(aestheticName, aestheticTransition)
      return tweened(aestheticValue, options)
    }
  }

  throw new Error(`Invalid transition for ${aestheticName}`)
}

function createOptionsFromDuration (aestheticName, duration) {
  switch (aestheticName) {
    case 'geometry':
      return { duration, easing: cubicOut, interpolate: transitionGeometries }

    default:
      return { duration, easing: cubicOut, interpolate: interpolateLayer }
  }
}

function createOptionsFromOptions (aestheticName, transitionOptions) {
  switch (aestheticName) {
    case 'geometry':
      return Object.assign({ interpolate: transitionGeometries }, transitionOptions)

    default:
      return Object.assign({ interpolate: interpolateLayer }, transitionOptions)
  }
}

function interpolateLayer (a, b) {
  const aWithoutObsoleteIndices = {}

  for (const index in a) {
    if (index in b) {
      aWithoutObsoleteIndices[index] = a[index]
    }
  }

  return interpolate(aWithoutObsoleteIndices, b)
}
