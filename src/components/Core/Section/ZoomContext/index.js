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
    if (isZoomIdentityObject(zoomId)) {
      let zoomIdentityFunction = zoomIdentity.translate(zoomId.x, zoomId.y).scale(zoomId.k)
      console.log(zoomIdentityFunction)
      zoomContext.set(zoomIdentityFunction)
    }

    if (isZoomIdentityFuction(zoomId)) {
      zoomContext.set(zoomId)
    }
  }

  if (!zoomId) {
    zoomContext.set(undefined)
  }
}
