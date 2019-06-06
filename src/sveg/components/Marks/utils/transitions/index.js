import { writable } from 'svelte/store'
import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolateRgb } from 'd3-interpolate'
import transitionPoints from './geometryTransitions/transitionPoints.js'

export function createTransitionableAesthetic (aestheticName, aestheticValue, transitionOptions) {
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
      return tweened(aestheticValue, aestheticTransition)
    }
  }

  throw new Error(`Invalid transition for ${aestheticName}`)
}

function createOptionsFromDuration (aestheticName, duration) {
  switch (aestheticName) {
    case 'fill':
      return { duration, easing: cubicOut, interpolate: interpolateRgb }

    case 'coordinates':
      // 'coordinates' is an Array of points: [[a, b], [c, d], ...]
      return { duration, easing: cubicOut, interpolate: transitionPoints }

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
