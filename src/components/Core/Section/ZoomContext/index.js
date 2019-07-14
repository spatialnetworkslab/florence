import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  let zoomContext = writable()
  setContext(key, zoomContext)

  return zoomContext
}

export function update (zoomContext, zoomId) {
  if (zoomId) {
    let { x, y, k } = zoomId
    let transformation = p => [p[0] * k + x, p[1] * k + y]

    zoomContext.set(transformation)
  }

  if (!zoomId) {
    zoomContext.set(undefined)
  }
}
