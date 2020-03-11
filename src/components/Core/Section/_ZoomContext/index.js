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

export function update (zoomContext, zoomIdentity) {
  if (zoomIdentity) {
    zoomContext.set(createZoomContext(zoomIdentity))
  }

  if (!zoomIdentity) {
    zoomContext.set(undefined)
  }
}

function createZoomContext (zoomIdentity) {
  const parsedZoomIdentity = parseZoomIdentity(zoomIdentity)
  const transformation = createZoomFunction(zoomIdentity)

  return { ...parsedZoomIdentity, transformation }
}

function parseZoomIdentity (zoomIdentity) {
  const defaults = { x: 0, y: 0, kx: 1, ky: 1 }
  return Object.assign(defaults, zoomIdentity)
}

function createZoomFunction (zoomIdentity) {
  const { x, y, kx, ky } = zoomIdentity
  const transformation = p => [p[0] * kx + x, p[1] * ky + y]
  const inverseTransformation = p => [(p[0] - x) / kx, (p[1] - y) / ky]
  transformation.invert = inverseTransformation

  return transformation
}
