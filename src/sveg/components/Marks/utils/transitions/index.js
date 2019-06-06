import { writable, get } from 'svelte/store'
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
    
    if (aestheticTransition.constructor === Number) {
      let options = createOptionsFromDuration(aestheticName, transitionOptions)
      return tweened(aestheticValue, options)
    }

    if (aestheticTransition.constructor === Object) return tweened(aestheticValue, aestheticTransition)
  }

  throw new Error(`Invalid transition for ${aestheticName}`)
}

function createOptionsFromDuration (aestheticName, duration) {
  switch (aestheticName) {
    case 'fill':
      return { duration, easing: cubicOut, interpolate: interpolateRgb }

    case 'points':
      return { duration, easing: cubicOut, interpolate: transitionPoints }

    default:
      return { duration, easing: cubicOut }
  }
}
