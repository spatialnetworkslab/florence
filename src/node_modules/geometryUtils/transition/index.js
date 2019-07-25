import { interpolate } from 'd3-interpolate'
import transshape from './transshape.umd.js'

export function transitionGeometry (fromGeometry, toGeometry) {
  if (pointTransition(fromGeometry, toGeometry)) {
    return interpolate(fromGeometry, toGeometry)
  }

  if (polygonTransition(fromGeometry, toGeometry)) {
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
    return transshape.transshapeLayer(fromLayer, toLayer)
  }
}

function pointTransition (fromGeometry, toGeometry) {
  return fromGeometry.type === 'Point' && toGeometry.type === 'Point'
}

const polygonTypes = ['Polygon', 'MultiPolygon']

function polygonTransition (fromGeometry, toGeometry) {
  return polygonTypes.includes(fromGeometry.type) &&
    polygonTypes.includes(toGeometry.type)
}

function getFirstGeometry (layer) {
  return layer[Object.keys(layer)[0]]
}
