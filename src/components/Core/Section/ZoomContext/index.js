const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  let zoomContext = writable()
  setContext(key, zoomContext)

  return zoomContext
}

export function update (zoomContext, zoomIdentity) {
  zoomContext.set(zoomIdentity)
}
