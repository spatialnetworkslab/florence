import { createPixelGeometryFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'

export default function createPixelGeometry (
  geometryProps,
  sectionContext,
  renderSettings
) {
  // filter for allowed props; leave any undefined props in place
  const allowedProps =
    (({
      x1 = undefined,
      y1 = undefined,
      x2 = undefined,
      y2 = undefined,
      independentAxis = undefined
    }) => ({ x1, y1, x2, y2, independentAxis }))(geometryProps)

  const scaledGeometry = createScaledGeometry(scaleCoordinates(augmentProps(validateProps(normalize(
    allowedProps,
    sectionContext
  ))), sectionContext))

  return createPixelGeometryFromGeometry(
    scaledGeometry,
    sectionContext,
    renderSettings,
    false
  )
}

function normalize ({ independentAxis, ...coordinateProps }, sectionContext) {
  const normalized = Object.entries(coordinateProps).reduce((acc, [k, v]) => {
    const extracted = typeof v === 'function' ? v(sectionContext) : v

    acc[k] = {
      type: extracted === undefined ? 'none' : Array.isArray(extracted) ? 'array' : 'singleton',
      ...(Array.isArray(extracted) && { arrayLength: extracted.length }),
      value: extracted,
      scaled: typeof v === 'function'
    }
    return acc
  }, {})
  normalized.independentAxis = independentAxis && independentAxis.toLowerCase()
  return normalized
}

export function validateProps (normalized) {
  const { independentAxis, ...coordinateProps } = normalized

  const definedTypes = ['singleton', 'array']
  const definedProps = Object.entries(coordinateProps)
    .filter(([k, v]) => definedTypes.includes(v.type))
    .reduce((acc, [k, v]) => {
      acc[k] = coordinateProps[k]
      return acc
    }, {})

  const definedKeys = Object.keys(definedProps)

  // reject if props do not include x1 and y1
  const containsx1y1 = ['x1', 'y1'].every(k => definedKeys.includes(k))
  if (!containsx1y1) { throw new Error('At least x1 and y1 must be provided') }

  // reject if at least x1 or y1 is not an array
  if (definedProps.x1.type === 'singleton' && definedProps.y1.type === 'singleton') {
    throw new Error('At least x1 or y1 must be passed an array')
  }

  // reject if independentAxis does not align with x/y types
  if (!independentAxis || independentAxis === 'x') {
    // check that x is the independent variable
    // reject if x1 is not given an array of at least length 2 - x must not be constant
    // x1 should also be distinct (for all types) and monotonically increasing for Number/Date types, but no checks will be performed for these
    if (definedProps.x1.type === 'singleton' || (definedProps.x1.type === 'array' && definedProps.x1.arrayLength < 2)) {
      throw new Error('x1 must be passed an array of at least length 2 when independentAxis is "x" or undefined')
    }
    // reject if x1, y1 and x2 are provided but independentAxis is not y
    if (definedKeys.includes('x2')) {
      throw new Error('independentAxis must be "y" when x1, y1 and x2 are specified')
    }
  } else if (independentAxis === 'y') {
    // check that y is the independent variable
    // reject if y1 is not given an array of at least length 2 - y must not be constant
    // y1 should also be distinct (for all types) and monotonically increasing for Number/Date types, but no checks will be performed for these
    if (definedProps.y1.type === 'singleton' || (definedProps.y1.type === 'array' && definedProps.y1.arrayLength < 2)) {
      throw new Error('y1 must be passed an array of at least length 2 when independentAxis is "y"')
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
  const arrayLengths = Object.values(definedProps)
    .filter(v => v.type === 'array')
    .map(v => v.value.length)

  const arrayLengthsEqual = arrayLengths.every((val, idx, arr) => val === arr[0])
  if (!arrayLengthsEqual) { throw new Error('Arrays given must be of equal length') }

  return normalized
}

export function augmentProps ({ independentAxis, x1, y1, x2, y2 }) {
  const indAx = !independentAxis || independentAxis === 'x' ? 'x' : 'y'

  const [indKey, indVal] = indAx === 'x' ? ['x1', x1] : ['y1', y1]
  const [depKey1, depVal1] = indAx === 'x' ? ['y1', y1] : ['x1', x1]
  const [depKey2, depVal2] = indAx === 'x' ? ['y2', y2] : ['x2', x2]
  const length = indVal.arrayLength

  const depVal1Map = {
    singleton: {
      value: Array(length).fill(depVal1.value),
      type: 'array',
      arrayLength: length
    },
    array: depVal1
  }
  const depVal2Map = {
    singleton: {
      value: Array(length).fill(depVal2.value),
      type: 'array',
      arrayLength: length
    },
    none: {
      value: Array(length).fill(0),
      type: 'array',
      arrayLength: length
    },
    array: depVal2
  }

  return {
    independentAxis: indAx,
    [indKey]: indVal,
    [depKey1]: depVal1Map[depVal1.type],
    [depKey2]: depVal2Map[depVal2.type]
  }
}

const scaleMap = { x1: 'scaleX', y1: 'scaleY', x2: 'scaleX', y2: 'scaleY' }

export function scaleCoordinates ({ independentAxis, ...coordinateProps }, sectionContext) {
  const scaledProps = Object.entries(coordinateProps).reduce((acc, [k, v]) => {
    if (v.scaled) {
      acc[k] = v.value
    } else {
      const scale = sectionContext[scaleMap[k]]
      acc[k] = v.value.map(d => scale(d))
    }
    return acc
  }, {})
  return { independentAxis, ...scaledProps }
}

export function createScaledGeometry ({ x1, y1, x2, y2, independentAxis }) {
  // polygon outer ring is defined counterclockwise

  let bottomPoints, topPoints

  if (independentAxis === 'x') {
    bottomPoints = y2.map((y2, i) => [x1[i], y2])
    topPoints = y1.map((y1, i) => [x1[i], y1]).reverse()
  } else { // y independent
    bottomPoints = x2.map((x2, i) => [x2, y1[i]])
    topPoints = x1.map((x1, i) => [x1, y1[i]]).reverse()
  }

  const origin = [bottomPoints[0]]
  const allPoints = [bottomPoints.concat(topPoints, origin)]

  const scaledGeometryArray = { type: 'Polygon', coordinates: allPoints }
  return scaledGeometryArray
}
