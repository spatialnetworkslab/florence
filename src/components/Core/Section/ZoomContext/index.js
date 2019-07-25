import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  const zoomContext = writable()
  setContext(key, zoomContext)

  return zoomContext
}

export function update (zoomContext, zoomId) {
  if (zoomId) {
    const { x, y, k } = zoomId
    const transformation = p => [p[0] * k + x, p[1] * k + y]
    zoomContext.set(transformation)
  }

  if (!zoomId) {
    zoomContext.set(undefined)
  }
}
