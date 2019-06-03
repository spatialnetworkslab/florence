import { getContext, setContext, onDestroy } from 'svelte'
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
        case 'cartesian':
          this._transformation = c => c
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
  // silly hack for when there is no CoordinateTransformation context
  return getContext(key) ? getContext(key) : writable()
}

export function init () {
  let coordinateTransformationContext = writable()
  setContext(key, coordinateTransformationContext)

  return coordinateTransformationContext
}

export function update (coordinateTransformationContext, options) {
  coordinateTransformationContext.set(new CoordinateTransformationContext(options))
}

export function ensureNotNested () {
  if (getContext(key)) {
    throw new Error('Cannot nest CoordinateTransformation components')
  }
}
