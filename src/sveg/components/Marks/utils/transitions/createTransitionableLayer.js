import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolateLayer } from './interpolateLayer.js'
import { transitionGeometryLayer } from './geometry'

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
    let options = createOptionsFromDuration(aestheticName, transitionOptions)
    return tweened(aestheticValue, options)
  }

  if (transitionOptions.constructor === Object) {
    if (!transitionOptions.hasOwnProperty(aestheticName)) return writable(aestheticValue)

    let aestheticTransition = transitionOptions[aestheticName]

    if (aestheticTransition && aestheticTransition.constructor === Number) {
      let options = createOptionsFromDuration(aestheticName, aestheticTransition)
      return tweened(aestheticValue, options)
    }

    if (aestheticTransition && aestheticTransition.constructor === Object) {
      let options = createOptionsFromOptions(aestheticName, aestheticTransition)
      return tweened(aestheticValue, options)
    }
  }

  throw new Error(`Invalid transition for ${aestheticName}`)
}

function createOptionsFromDuration (aestheticName, duration) {
  switch (aestheticName) {
    case 'geometry':
      return { duration, easing: cubicOut, interpolate: transitionGeometryLayer }

    default:
      return { duration, easing: cubicOut, interpolate: interpolateLayer }
  }
}

function createOptionsFromOptions (aestheticName, transitionOptions) {
  switch (aestheticName) {
    case 'geometry':
      return Object.assign({ interpolate: transitionGeometryLayer }, transitionOptions)

    default:
      return Object.assign({ interpolate: interpolateLayer }, transitionOptions)
  }
}
