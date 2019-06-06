<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinatesLayer } from './generateCoordinates.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import { getNPoints } from './layerUtils.js'
  import { generatePropArray } from '../utils/generatePropArray.js'

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  let length = getNPoints(x, y)
  const getLength = () => length
  const setLength = input => length = input

  // Convert coordinate arrays
  let { xArray, yArray } = generateCoordinatesLayer(
    { x, y }, $sectionContext, $coordinateTransformationContext, length
  )

  // Generate other prop arrays
  let radiusArray = generatePropArray(radius, length)
  let fillArray = generatePropArray(fill, length)

  // Create transitionables
  let tr_xArray = createTransitionable('x', xArray, transition)
  let tr_yArray = createTransitionable('y', yArray, transition)
  let tr_radiusArray = createTransitionable('radius', radiusArray, transition)
  let tr_fillArray = createTransitionable('fill', fillArray, transition)
  
  $: {
    if (initDone()) {
      setLength(getNPoints(x, y))

      let { xArray, yArray } = generateCoordinatesLayer(
        { x, y }, $sectionContext, $coordinateTransformationContext, getLength()
      )
      tr_xArray.set(xArray)
      tr_yArray.set(yArray)
    }
  }

  $: { if (initDone()) tr_radiusArray.set(generatePropArray(radius, getLength())) }
  $: { if (initDone()) tr_fillArray.set(generatePropArray(fill, getLength())) }

  let previousTransition

  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_xArray = createTransitionable('x', $tr_xArray, transition)
      tr_yArray = createTransitionable('y', $tr_yArray, transition)
      tr_radiusArray = createTransitionable('radius', $tr_radiusArray, transition)
      tr_fillArray = createTransitionable('fill', $tr_fillArray, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })
</script>

{#if $graphicContext.output() === 'svg'}

  {#each xArray as _, i}

    <circle 
      cx={$tr_xArray[i]} 
      cy={$tr_yArray[i]} 
      r={$tr_radiusArray[i]} 
      fill={$tr_fillArray[i]} 
    />

  {/each}

{/if}