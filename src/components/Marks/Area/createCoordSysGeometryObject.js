import { createCoordSysGeometryObject } from '../utils/createCoordSysGeometry.js'
import { createScaledGeometry, validateProps, augmentProps, scaleCoordinates } from './createCoordSysGeometry.js'
import getKeyArray from '../utils/getKeyArray.js'

export default function (positioningProps, sectionContext, coordinateTransformationContext, keyProp, interpolate) {
  // filter for allowed props; leave any undefined props in place
  const allowedProps =
    (({
      x1 = undefined,
      y1 = undefined,
      x2 = undefined,
      y2 = undefined,
      independentAxis = undefined
    }) => ({ x1, y1, x2, y2, independentAxis }))(positioningProps)

  const { validatedProps, numAreas } = validateNumAreas(allowedProps)

  // pivot data for use with area mark methods
  const validatedPropArray = [...Array(numAreas).keys()].map(areaIndex => {
    return {
      x1: validatedProps.x1 && validatedProps.x1[areaIndex],
      y1: validatedProps.y1 && validatedProps.y1[areaIndex],
      x2: validatedProps.x2 && validatedProps.x2[areaIndex],
      y2: validatedProps.y2 && validatedProps.y2[areaIndex],
      independentAxis: validatedProps.independentAxis
    }
  })

  const scaledGeometryArray = validatedPropArray.map(area => {
    return createScaledGeometry(
      scaleCoordinates(
        augmentProps(
          validateProps(area)),
        sectionContext))
  })

  const keyArray = getKeyArray(keyProp, numAreas)

  const coordSysGeometryObject =
    createCoordSysGeometryObject(
      scaledGeometryArray,
      coordinateTransformationContext,
      keyArray,
      interpolate)

  return coordSysGeometryObject
}

function validateNumAreas (allowedProps) {
  const propsWithArray = Object.values(allowedProps).filter(v => Array.isArray(v))

  const numAreasAll = Object.values(propsWithArray).reduce((accum, elem) => {
    accum.push(elem.length)
    return accum
  }, [])

  const numAreasEqual = numAreasAll.every((val, idx, arr) => val === arr[0])
  let numAreas
  if (!numAreasEqual) {
    throw new Error('Number of areas declared per prop must be equal')
  } else { numAreas = numAreasAll[0] }

  return { validatedProps: allowedProps, numAreas: numAreas }
}
