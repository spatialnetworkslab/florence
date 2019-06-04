import { tweened } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'
import { interpolateRgb } from 'd3-interpolate'

export function createTransitionableAesthetic (aestheticName, aestheticValue, transition) {
  return tweened(aestheticValue, createOptions(aestheticName, transition))
}

export function createOptions (aestheticName, transition) {
  if (transition === undefined) {
    return createDummyOptions()
  }

  if (transition.constructor === Number) {
    return createOptionsFromDuration(aestheticName, transition)
  }

  if (transition.constructor === Object) {
    if (!transition.hasOwnProperty(aestheticName)) return createDummyOptions()

    return transition[aestheticName]
  }

  throw new Error(`Invalid transition for ${aestheticName}`)
}

function createDummyOptions () {
  return { duration: 0, interpolate: dummyInterpolator }
}

function dummyInterpolator (start, end) {
  return _ => end
}

function createOptionsFromDuration (aestheticName, duration) {
  if (aestheticName === 'fill') {
    return { duration, easing: cubicOut, interpolate: interpolateRgb }
  } else {
    return { duration, easing: cubicOut }
  }
}
