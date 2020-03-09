import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { createIdentityTransformation } from './indentity.js'
import { createPolarTransformation } from './polar.js'

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  const coordinateTransformationContext = writable()
  setContext(key, coordinateTransformationContext)

  return coordinateTransformationContext
}

export function update (coordinateTransformationContext, options) {
  if (options.transformation) {
    coordinateTransformationContext.set(createCoordinateTransformationContext(options))
  } else {
    coordinateTransformationContext.set(undefined)
  }
}

export function ensureNotParent (ctx) {
  if (ctx) {
    throw new Error(
      'Sections with a coordinate transformation cannot contain anything other than Marks or Layers'
    )
  }
}

const createTransformation = {
  identity: createIdentityTransformation,
  polar: createPolarTransformation
}

function createCoordinateTransformationContext ({ rangeX, rangeY, transformation: type }) {
  const transformation = createTransformation[type](rangeX, rangeY)
  return { transformation, type }
}
