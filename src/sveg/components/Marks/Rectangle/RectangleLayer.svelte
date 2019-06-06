<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinatesLayer } from './generateCoordinates.js'
  import { generatePropArray } from '../utils/generatePropArray.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let fill = 'black'
  export let opacity = 1
  export let transition = undefined
  export let interpolate = true

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  let length = getNPoints(x, y)
  const getLength = () => length
  const setLength = input => length = input

  // Convert coordinate array
  let coordinateArray = generateCoordinatesLayer(
    { x1, x2, y1, y2 },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate,
    length
  )

  // Generate other prop arrays
  let fillArray = generatePropArray(fill, length)
  let opacityArray = generatePropArray(opacity, length)

  // Create transitionables
  let tr_coordinateArray = createTransitionable('coordinates', coordinateArray, transition, { layer: true })
  let tr_fillArray = createTransitionable('fill', fillArray, transition)
  let tr_opacityArray = createTransitionable('opacity', opacityArray, transition)
</script>