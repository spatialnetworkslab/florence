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
    if (isUndefined(zoomIdentity)) {
      return undefined
    }

    if (isDefined(zoomIdentity)) {
      return createZoomFunction(zoomIdentity)
    }
  }
}

export function createZoomFunction (zoomIdentity) {
  ensureValidZoomIdentity(zoomIdentity)

  const { x, y, kx, ky } = getZoomParams(zoomIdentity)
  const transformation = p => [p[0] * kx + x, p[1] * ky + y]
  const inverseTransformation = p => [(p[0] - x) / kx, (p[1] - y) / ky]
  transformation.invert = inverseTransformation

  return transformation
}

function ensureValidZoomIdentity (zoomIdentity) {
  if (hasValid(zoomIdentity, 'x') && hasValid(zoomIdentity, 'y')) {
    if (hasValid(zoomIdentity, 'k')) {
      return
    }

    if (hasValid(zoomIdentity, 'kx') && hasValid(zoomIdentity, 'ky')) {
      return
    }
  }

  throw new Error(`Invalid zoomIdentity: '${JSON.stringify(zoomIdentity)}`)
}

function hasValid (zoomIdentity, key) {
  return key in zoomIdentity && zoomIdentity[key].constructor === Number
}

function getZoomParams (zoomIdentity) {
  const x = zoomIdentity.x
  const y = zoomIdentity.y
  const kx = hasValid(zoomIdentity, 'kx') ? zoomIdentity.kx : zoomIdentity.k
  const ky = hasValid(zoomIdentity, 'ky') ? zoomIdentity.ky : zoomIdentity.k

  return { x, y, kx, ky }
}

function reconcileZoomIdentities (zoomContext, zoomIdentity) {
  const newZoomIdentity = {}
  Object.assign(newZoomIdentity, zoomContext)
  Object.assign(newZoomIdentity, zoomIdentity)

  return newZoomIdentity
}
