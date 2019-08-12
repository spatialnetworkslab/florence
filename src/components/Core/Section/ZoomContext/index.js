import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { isDefined, isUndefined } from '../../../../utils/equals.js'

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
    zoomContext.set(zoomIdentity)
  }

  if (!zoomIdentity) {
    zoomContext.set(undefined)
  }
}

export function createZoomTransformation (zoomContext, zoomIdentity) {
  if (isDefined(zoomContext)) {
    if (isUndefined(zoomIdentity)) {
      return createZoomFunction(zoomContext)
    }

    if (isDefined(zoomIdentity)) {
      const combinedZoomIdentity = reconcileZoomIdentities(zoomContext, zoomIdentity)
      return createZoomFunction(combinedZoomIdentity)
    }
  }

  if (isUndefined(zoomContext)) {
    if (isDefined(zoomIdentity)) {
      return createZoomFunction(zoomIdentity)
    }

    if (isUndefined(zoomIdentity)) {
      return undefined
    }
  }
}

function createZoomFunction (zoomIdentity) {
  ensureValidZoomIdentity(zoomIdentity)

  const { x, y, k } = zoomIdentity
  const transformation = p => [p[0] * k + x, p[1] * k + y]
  const inverseTransformation = p => [(p[0] - x) / k, (p[1] - y) / k]
  transformation.invert = inverseTransformation

  return transformation
}

function ensureValidZoomIdentity (zoomIdentity) {
  if (
    'x' in zoomIdentity && zoomIdentity.x.constructor === Number &&
    'y' in zoomIdentity && zoomIdentity.y.constructor === Number &&
    'k' in zoomIdentity && zoomIdentity.k.constructor === Number
  ) {
    return
  }

  throw new Error(`Invalid zoomIdentity: '${JSON.stringify(zoomIdentity)}`)
}

function reconcileZoomIdentities (zoomContext, zoomIdentity) {
  return Object.assign(zoomContext, zoomIdentity)
}
