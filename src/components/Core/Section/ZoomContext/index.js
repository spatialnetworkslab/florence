import { zoomIdentity } from 'd3-zoom'

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
    let zoomIdentityFunction = zoomIdentity.translate(zoomId.x, zoomId.y).scale(zoomId.k)
    zoomContext.set(zoomIdentityFunction)
  }

  if (!zoomId) {
    zoomContext.set(undefined)
  }
}
