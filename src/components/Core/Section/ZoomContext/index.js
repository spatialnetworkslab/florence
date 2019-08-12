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
    const transformation = createZoomTransformation(zoomIdentity)
    zoomContext.set(transformation)
  }

  if (!zoomIdentity) {
    zoomContext.set(undefined)
  }
}

export function createZoomTransformation (zoomIdentity) {
  ensureValidZoomIdentity(zoomIdentity)

  const { x, y, k } = zoomIdentity
  const transformation = p => [p[0] * k + x, p[1] * k + y]
  const inverseTransformation = p => [(p[0] - x) / k, (p[1] - y) / k]
  transformation.invert = inverseTransformation

  return transformation
}

function ensureValidZoomIdentity (zoomIdentity) {
  if ('x' in zoomIdentity && 'y' in zoomIdentity && 'k' in zoomIdentity) {
    if (Object.keys(zoomIdentity).every(key => {
      return zoomIdentity[key].constructor === Number
    })) {
      return
    }
  }

  throw new Error(`Invalid zoomIdentity: '${JSON.stringify(zoomIdentity)}`)
}
