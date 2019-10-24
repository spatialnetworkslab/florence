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
        }) =>
          ({ x1, y1, x2, y2, independentAxis }))(positioningProps)

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

function validateProps (allowedProps) {
  // validate only defined coordinate props
  const definedProps = {}
  for (const [key, value] of Object.entries(allowedProps)) {
    if (value !== undefined) {
      definedProps[key] = value
    }
  }

  // reject if props do not include x1 and y1
  const contains = ['x1', 'y1'].every(prop => Object.keys(definedProps).includes(prop))
  if (!contains) { throw new Error('At least x1 and y1 must be provided') }

  // reject if at least one of x1 or y1 is not an array
  const { x1, y1 } = definedProps
  if (!(Array.isArray(x1) || Array.isArray(y1))) {
    throw new Error('At least x1 or y1 must be passed an array')
  }

  // reject if independentAxis does not align with x/y types
  const independentAxis = definedProps.independentAxis &&
        definedProps.independentAxis.toLowerCase()

  // undefined independentAxis defaults to x
  if (!independentAxis || independentAxis === 'x') {
    // check that x is actually the independent variable
    // reject if x1 is not given an array; x cannot be a constant and hence cannot be broadcasted
    if (!Array.isArray(x1)) {
      throw new Error('x1 must be passed an array when independentAxis is "X" or undefined')
    }
    if (!(x1[0].constructor === String || x1[0].constructor === Date)) {
      throw new Error(`x1 must be a categorical or temporal variable
when independentAxis is 'X' or undefined`)
    }
  } else if (independentAxis === 'y') {
    // check that y is actually the independent variable
    // reject if y1 is not given an array; y cannot be a constant and hence cannot be broadcasted
    if (!Array.isArray(y1)) {
      throw new Error('y1 must be passed an array when independentAxis is "Y"')
    }
    if (!(y1[0].constructor === String || y1[0].constructor === Date)) {
      throw new Error(`y1 must be a categorical or temporal variable
when independentAxis is 'Y'`)
    }
  } else {
    // reject if defined independentAxis is passed a value other than X or Y
    throw new Error('independentAxis must be passed "X" or "Y" or left blank')
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

function augmentProps (allowedProps) {
  let { x1, y1, x2, y2, independentAxis } = allowedProps
  independentAxis = independentAxis && independentAxis.toLowerCase()

  // x is independent
  if (!independentAxis || independentAxis === 'x') {
    // if y1 is not an array, broadcast its value
    if (!Array.isArray(y1)) { y1 = Array(x1.length).fill(y1) }
    if (y2 === undefined) { y2 = Array(x1.length).fill(0) }
    // if all 4 props are provided, x2 is ignored
    return { coordinates: { x1: x1, y1: y1, y2: y2 }, independentAxis: 'x' }
  } else if (independentAxis === 'y') {
    // y is independent
    // if x1 is not an array, broadcast its value
    if (!Array.isArray(x1)) { x1 = Array(y1.length).fill(x1) }
    if (x2 === undefined) { x2 = Array(y1.length).fill(0) }
    // if all 4 props are provided, y2 is ignored
    return { coordinates: { x1: x1, y1: y1, x2: x2 }, independentAxis: 'y' }
  }
}

const scaleMap = { x1: 'scaleX', y1: 'scaleY', x2: 'scaleX', y2: 'scaleY' }

function scaleCoordinates (augmentedProps, sectionContext) {
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

function createScaledGeometry (scaledProps) {
  // polygon outer ring is defined counterclockwise

  const bottomPoints = scaledProps.y2.map((y2, i) => [scaledProps.x1[i], y2])
  const topPoints = scaledProps.y1.map((y1, i) => [scaledProps.x1[i], y1]).reverse()
  const allPoints = [bottomPoints.concat(topPoints)]

  const scaledGeometryArray = { type: 'Polygon', coordinates: allPoints }
  return scaledGeometryArray
}
