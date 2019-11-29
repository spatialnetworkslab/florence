import { createCoordSysGeometry } from '../utils/createCoordSysGeometry.js'

export default function (positioningProps, sectionContext, coordinateTransformationContext, interpolate) {
  // filter for allowed props; leave any undefined props in place
  const allowedProps =
    (({
      x1 = undefined,
      y1 = undefined,
      x2 = undefined,
      y2 = undefined,
      independentAxis = undefined
    }) => ({ x1, y1, x2, y2, independentAxis }))(positioningProps)

  const coordSysGeometry =
    createCoordSysGeometry(
      createScaledGeometry(
        scaleCoordinates(
          augmentProps(
            validateProps(allowedProps)),
          sectionContext)),
      coordinateTransformationContext,
      interpolate)

  return coordSysGeometry
}

export function validateProps (allowedProps) {
  // validate only defined coordinate props
  const definedProps = {}
  for (const [key, value] of Object.entries(allowedProps)) {
    if (value !== undefined) {
      definedProps[key] = value
    }
  }

  const definedKeys = Object.keys(definedProps)

  // reject if props do not include x1 and y1
  const containsx1y1 = ['x1', 'y1'].every(prop => definedKeys.includes(prop))
  if (!containsx1y1) { throw new Error('At least x1 and y1 must be provided') }

  // reject if at least one of x1 or y1 is not an array
  // assumes containsx1y1 check passes
  if (!(Array.isArray(definedProps.x1) || Array.isArray(definedProps.y1))) {
    throw new Error('At least x1 or y1 must be passed an array')
  }

  // reject if independentAxis does not align with x/y types
  const independentAxis = definedProps.independentAxis &&
        definedProps.independentAxis.toLowerCase()

  if (!independentAxis || independentAxis === 'x') {
    // check that x is the independent variable
    // reject if x1 is not given an array; x cannot be a constant and hence cannot be broadcasted
    if (!Array.isArray(definedProps.x1)) {
      throw new Error('x1 must be passed an array when independentAxis is "x" or undefined')
    }
    // reject if x1, y1 and x2 are provided but independentAxis is not y
    if (definedKeys.includes('x2')) {
      throw new Error('independentAxis must be "y" when x1, y1 and x2 are specified')
    }
  } else if (independentAxis === 'y') {
    // check that y is the independent variable
    // reject if y1 is not given an array; y cannot be a constant and hence cannot be broadcasted
    if (!Array.isArray(definedProps.y1)) {
      throw new Error('y1 must be passed an array when independentAxis is "y"')
    }
    // reject if x1, y1 and y2 are provided but independentAxis is not x
    if (definedKeys.includes('y2')) {
      throw new Error('independentAxis must be "x" when x1, y1 and y2 are specified')
    }
  } else {
    // reject if defined independentAxis is passed a value other than X or Y
    throw new Error('independentAxis must be passed "x" or "y" or left blank')
  }

  // reject if arrays given are not of equal length
  const arrayProps = Object.values(definedProps).filter(v => Array.isArray(v))

  const arrayLengths = Object.values(arrayProps).reduce((accum, elem) => {
    accum.push(elem.length)
    return accum
  }, [])

  const arrayLengthsEqual = arrayLengths.every((val, idx, arr) => val === arr[0])
  if (!arrayLengthsEqual) { throw new Error('Arrays given must be of equal length') }

  return allowedProps
}

export function augmentProps (allowedProps) {
  let { x1, y1, x2, y2, independentAxis } = allowedProps
  independentAxis = independentAxis && independentAxis.toLowerCase()

  // undefined independentAxis defaults to x
  if (!independentAxis || independentAxis === 'x') {
    // if y1 is not an array, broadcast its value
    if (!Array.isArray(y1)) { y1 = Array(x1.length).fill(y1) }
    if (y2 === undefined) { y2 = Array(x1.length).fill(0) }
    // if all 4 props are provided, x2 is ignored
    return { coordinates: { x1: x1, y1: y1, y2: y2 }, independentAxis: 'x' }
  } else if (independentAxis === 'y') {
    // if x1 is not an array, broadcast its value
    if (!Array.isArray(x1)) { x1 = Array(y1.length).fill(x1) }
    if (x2 === undefined) { x2 = Array(y1.length).fill(0) }
    // if all 4 props are provided, y2 is ignored
    return { coordinates: { x1: x1, y1: y1, x2: x2 }, independentAxis: 'y' }
  }
}

const scaleMap = { x1: 'scaleX', y1: 'scaleY', x2: 'scaleX', y2: 'scaleY' }

export function scaleCoordinates (augmentedProps, sectionContext) {
  const coordinateProps = augmentedProps.coordinates

  const scaledProps = {}

  const propKeys = Object.keys(coordinateProps)

  for (const prop of propKeys) {
    const scale = sectionContext[scaleMap[prop]]
    const scaledValues = coordinateProps[prop].map(v => scale(v))
    scaledProps[prop] = scaledValues
  }
  return scaledProps
}

export function createScaledGeometry (scaledProps) {
  // polygon outer ring is defined counterclockwise

  const propKeys = Object.keys(scaledProps)
  let bottomPoints, topPoints

  if (propKeys.includes('y2')) { // x independent
    bottomPoints = scaledProps.y2.map((y2, i) => [scaledProps.x1[i], y2])
    topPoints = scaledProps.y1.map((y1, i) => [scaledProps.x1[i], y1]).reverse()
  } else { // y independent
    bottomPoints = scaledProps.x2.map((x2, i) => [x2, scaledProps.y1[i]])
    topPoints = scaledProps.x1.map((x1, i) => [x1, scaledProps.y1[i]]).reverse()
  }
  const origin = [bottomPoints[0]]
  const allPoints = [bottomPoints.concat(topPoints, origin)]

  const scaledGeometryArray = { type: 'Polygon', coordinates: allPoints }
  return scaledGeometryArray
}