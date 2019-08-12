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
  if (
    'x' in zoomIdentity && zoomIdentity.x.constructor === Number &&
    'y' in zoomIdentity && zoomIdentity.y.constructor === Number
  ) {
    if ('k' in zoomIdentity && zoomIdentity.k.constructor === Number) {
      return
    }

    if (
      'kx' in zoomIdentity && zoomIdentity.kx.constructor === Number &&
      'ky' in zoomIdentity && zoomIdentity.ky.constructor === Number
    ) {
      return
    }
  }

  throw new Error(`Invalid zoomIdentity: '${JSON.stringify(zoomIdentity)}`)
}

function getZoomParams (zoomIdentity) {
  const x = zoomIdentity.x
  const y = zoomIdentity.y
  const kx = zoomIdentity.kx || zoomIdentity.k
  const ky = zoomIdentity.ky || zoomIdentity.k

  return { x, y, kx, ky }
}

function reconcileZoomIdentities (zoomContext, zoomIdentity) {
  const newZoomIdentity = {}
  Object.assign(newZoomIdentity, zoomContext)
  Object.assign(newZoomIdentity, zoomIdentity)

  return newZoomIdentity
}
