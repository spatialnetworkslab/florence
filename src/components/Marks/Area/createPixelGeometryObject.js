import { createPixelGeometryObjectFromGeometry } from '../utils/createPixelGeometryFromGeometry.js'
import { validateProps, augmentProps, scaleCoordinates, createScaledGeometry } from './createPixelGeometry.js'

export default function createPixelGeometryObject (
  geometryProps,
  keyProp,
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

  const { numAreas, independentAxis, ...augmentedAreas } =
    augmentAreas(
      validateAreas(
        normalizeAreas(
          allowedProps,
          sectionContext)))

  // pivot data for use with area mark methods
  const areasAsArray = [...Array(numAreas).keys()].map(areaIndex =>
    Object.entries(augmentedAreas).reduce((acc, [k, v]) => {
      const isNestedArray = v.type === 'array of arrays'

      acc[k] = {
        type: isNestedArray ? 'array' : 'none',
        value: isNestedArray ? v.value[areaIndex] : v.value,
        ...(isNestedArray && { arrayLength: v.value[areaIndex].length }),
        scaled: v.scaled
      }

      acc.independentAxis = independentAxis
      return acc
    }, {})
  )

  const scaledGeometryArray = areasAsArray.map(area => {
    return createScaledGeometry(
      scaleCoordinates(
        augmentProps(
          validateProps(
            area)),
        sectionContext))
  })

  return createPixelGeometryObjectFromGeometry(
    scaledGeometryArray,
    keyProp,
    sectionContext,
    renderSettings,
    false
  )
}

function normalizeAreas ({ independentAxis, ...coordinateProps }, sectionContext) {
  const normalized = Object.entries(coordinateProps).reduce((acc, [k, v]) => {
    const extracted = typeof v === 'function' ? v(sectionContext) : v

    const isUndefined = (x) => typeof x === 'undefined'
    const isSingleton = (x) => !isUndefined(x) && !Array.isArray(x)
    const isNestedArray = (xs) => !isUndefined(xs) && !isSingleton(xs) && xs.every(x => Array.isArray(x))

    acc[k] = {
      type: isUndefined(extracted)
        ? 'none'
        : isSingleton(extracted)
          ? 'singleton'
          : isNestedArray(extracted)
            ? 'array of arrays'
            : 'array',
      ...(isNestedArray(extracted) && { numAreas: extracted.length }),
      value: extracted,
      scaled: typeof v === 'function'
    }
    return acc
  }, {})

  normalized.independentAxis = independentAxis && independentAxis.toLowerCase()
  return normalized
}

function validateAreas (normalizedAreas) {
  const { independentAxis, ...coordinateProps } = normalizedAreas
  const { x1, x2, y1, y2 } = coordinateProps

  // reject singletons
  Object.values(coordinateProps).forEach(v => {
    if (v.type === 'singleton') {
      throw new Error('Props passed to the AreaLayer must be either an array or an array of arrays')
    }
  })

  const indAx = !independentAxis || independentAxis === 'x' ? 'x' : 'y'
  const [depKey1, depVal1] = indAx === 'x' ? ['y1', y1] : ['x1', x1]
  const [depKey2, depVal2] = indAx === 'x' ? ['y2', y2] : ['x2', x2]

  // only x1 can be broadcasted when x is the independent variable
  // only y1 can be broadcasted when y is the independent variable
  if (depVal1.type === 'array' || depVal2.type === 'array') {
    throw new Error(`${depKey1} and ${depKey2} must be passed an array of arrays when independentAxis is "${indAx}"`)
  }

  // reject if number of areas per prop are not equal
  const numAreasAll = Object.values(coordinateProps)
    .filter(v => v.type === 'array of arrays')
    .map(v => v.numAreas)

  const numAreasEqual = numAreasAll.every((val, idx, arr) => val === arr[0])
  if (!numAreasEqual) {
    throw new Error('Number of areas declared per prop must be equal')
  }

  const numAreas = numAreasAll[0]
  return { numAreas, independentAxis, ...normalizedAreas }
}

function augmentAreas ({ numAreas, independentAxis, x1, y1, x2, y2 }) {
  const indAx = !independentAxis || independentAxis === 'x' ? 'x' : 'y'
  const [indKey1, indVal1] = indAx === 'x' ? ['x1', x1] : ['y1', y1]
  const [indKey2, indVal2] = indAx === 'x' ? ['x2', x2] : ['y2', y2]
  const [depKey1, depVal1] = indAx === 'x' ? ['y1', y1] : ['x1', x1]
  const [depKey2, depVal2] = indAx === 'x' ? ['y2', y2] : ['x2', x2]

  const indValMap = {
    array: {
      value: Array(numAreas).fill(indVal1.value),
      type: 'array of arrays',
      numAreas: numAreas,
      scaled: indVal1.scaled
    },
    'array of arrays': indVal1
  }

  return {
    numAreas: numAreas,
    independentAxis: indAx,
    [indKey1]: indValMap[indVal1.type],
    [indKey2]: indVal2,
    [depKey1]: depVal1,
    [depKey2]: depVal2
  }
}
