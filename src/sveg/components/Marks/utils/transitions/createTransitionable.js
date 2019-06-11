import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolate } from 'd3-interpolate'
import transitionGeometry from './geometry'

export function createTransitionable (aestheticName, aestheticValue, transitionOptions, geometryType) {
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
    case 'fill':
      return { duration, easing: cubicOut, interpolate }

    case 'coordinates':
      return { duration, easing: cubicOut, interpolate: transitionGeometry[geometryType] }

    case 'geometry':
      return { duration, easing: cubicOut, interpolate: transitionGeometry[geometryType] }

    default:
      return { duration, easing: cubicOut }
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

  for (let aesthetic in a) {
    let aestheticA = a[aesthetic]
    let aestheticB = b[aesthetic]
    if (aestheticA.constructor !== Object) return aestheticA === aestheticB
    if (!aestheticTransitionObjectsEqual(aestheticA, aestheticB)) return false
  }

  return true
}

function aestheticTransitionObjectsEqual (a, b) {
  if (b.constructor !== Object) return false

  if (numberOfKeys(a) !== numberOfKeys(b)) return false

  for (let key in a) {
    if (a[key] !== b[key]) return false
  }

  return true
}

function numberOfKeys (obj) {
  return Object.keys(obj).length
}

function createOptionsFromOptions (aestheticName, transitionOptions, geometryType) {
  switch (aestheticName) {
    case 'fill':
      return Object.assign({ interpolate }, transitionOptions)

    case 'coordinates':
      return Object.assign({ interpolate: transitionGeometry[geometryType] }, transitionOptions)

    case 'geometry':
      return Object.assign({ interpolate: transitionGeometry[geometryType] }, transitionOptions)

    default:
      return transitionOptions
  }
}
