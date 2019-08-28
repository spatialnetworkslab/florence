import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { createPolarTransformation } from './polar.js'

class CoordinateTransformationContext {
  constructor ({ rangeX, rangeY, transformation }) {
    if (transformation.constructor === Function) {
      this._transformation = transformation(rangeX, rangeY)
      this._type = 'custom'
    }

    if (transformation.constructor === String) {
      this._type = transformation

      switch (transformation) {
        case 'identity':
          this._transformation = c => c
          this._transformation.invert = c => c
          break

        case 'polar':
          this._transformation = createPolarTransformation(rangeX, rangeY)
          break

        default:
          throw new Error(`Invalid transformation name: '${transformation}'`)
      }
    }
  }

  transform (coordinatePair) {
    return this._transformation(coordinatePair)
  }

  type () {
    return this._type
  }
}

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
    coordinateTransformationContext.set(new CoordinateTransformationContext(options))
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
