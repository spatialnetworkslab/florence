import { interpolate } from 'd3-interpolate'
import transshape from './transshape.umd.js'

export function transitionGeometry (fromGeometry, toGeometry) {
  if (pointTransition(fromGeometry, toGeometry)) {
    return interpolate(fromGeometry, toGeometry)
  }

  if (polygonTransition(fromGeometry, toGeometry)) {
    return transshape.transshape(fromGeometry, toGeometry)
  }

  if (lineStringTransition(fromGeometry, toGeometry)) {
    return transshape.transshape(fromGeometry, toGeometry)
  }

  throw new Error('Invalid input')
}

export function transitionGeometries (fromLayer, toLayer) {
  const firstFromGeometry = getFirstGeometry(fromLayer)
  const firstToGeometry = getFirstGeometry(toLayer)

  if (pointTransition(firstFromGeometry, firstToGeometry)) {
    return interpolate(fromLayer, toLayer)
  }

  if (polygonTransition(firstFromGeometry, firstToGeometry)) {
    return transitionLayer(fromLayer, toLayer)
  }

  if (lineStringTransition(firstFromGeometry, firstToGeometry)) {
    return transitionLayer(fromLayer, toLayer)
  }

  throw new Error('Invalid input')
}

function pointTransition (fromGeometry, toGeometry) {
  return fromGeometry.type === 'Point' && toGeometry.type === 'Point'
}

const polygonTypes = ['Polygon', 'MultiPolygon']

function polygonTransition (fromGeometry, toGeometry) {
  return polygonTypes.includes(fromGeometry.type) &&
    polygonTypes.includes(toGeometry.type)
}

const lineStringTypes = ['LineString', 'MultiLineString']

function lineStringTransition (fromGeometry, toGeometry) {
  return lineStringTypes.includes(fromGeometry.type) &&
    lineStringTypes.includes(toGeometry.type)
}

function getFirstGeometry (layer) {
  return layer[Object.keys(layer)[0]]
}

function transitionLayer (fromLayer, toLayer) {
  const keyUnion = getKeyUnion(fromLayer, toLayer)
  const interpolatorObject = {}

  for (const key of keyUnion) {
    interpolatorObject[key] = transshape.transshape(fromLayer[key], toLayer[key])
  }

  return function interpolator (t) {
    if (t === 0) return fromLayer
    if (t === 1) return toLayer

    const layer = {}
    for (const key in interpolatorObject) {
      layer[key] = interpolatorObject[key](t)
    }

    return layer
  }
}

function getKeyUnion (fromLayer, toLayer) {
  const keyArray = Object.keys(fromLayer).concat(Object.keys(toLayer))
  return new Set(keyArray)
}
