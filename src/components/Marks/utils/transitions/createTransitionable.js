import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolate } from 'd3-interpolate'
import { transitionGeometry } from '../../../../utils/geometryUtils/index.js'
import { isUndefined } from '../../../../utils/equals.js'

/**
 * Returns either a Svelte store, or a Svelte 'tweened' store,
 * depending on whether the user specified transition options.
 * The way the tweened store is set up depends on the type of aesthetic,
 * and which options the user has chosen.
 *
 * @param {String} aestheticName The name of the aesthetic a store is created for.
 * @param {*} aestheticValue The initial value of the store.
 * @param {Number|Object} transitionOptions A number indicating the transtion duration, or an Object
 * with aesthetic names as keys, and Numbers OR Objects as values.
 * @returns {writable|tweened}
 */
export function createTransitionable (aestheticName, aestheticValue, transitionOptions) {
  if (isUndefined(transitionOptions) || isUndefined(aestheticValue)) {
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
  if (aestheticName === 'geometry') {
    return { duration, easing: cubicOut, interpolate: transitionGeometry }
  } else {
    return { duration, easing: cubicOut, interpolate }
  }
}

export function transitionsEqual (a, b) {
  if (a === undefined || b === undefined) return a === b

  if (a.constructor !== Object) return a === b

  return transitionObjectsEqual(a, b)
}

function transitionObjectsEqual (a, b) {
  if (b.constructor !== Object) return false

  if (numberOfKeys(a) !== numberOfKeys(b)) return false

  for (const aesthetic in a) {
    const aestheticA = a[aesthetic]
    const aestheticB = b[aesthetic]
    if (aestheticA.constructor !== Object) return aestheticA === aestheticB
    if (!aestheticTransitionObjectsEqual(aestheticA, aestheticB)) return false
  }

  return true
}

function aestheticTransitionObjectsEqual (a, b) {
  if (b.constructor !== Object) return false

  if (numberOfKeys(a) !== numberOfKeys(b)) return false

  for (const key in a) {
    if (a[key] !== b[key]) return false
  }

  return true
}

function numberOfKeys (obj) {
  return Object.keys(obj).length
}

function createOptionsFromOptions (aestheticName, transitionOptions) {
  if (aestheticName === 'geometry') {
    return Object.assign({ interpolate: transitionGeometry }, transitionOptions)
  } else {
    return Object.assign({ interpolate }, transitionOptions)
  }
}
