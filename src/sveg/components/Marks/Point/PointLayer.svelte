<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinatesLayer } from './generateCoordinatesLayer.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined
  export let index

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  // Generate coordinate objects
  let { xObject, yObject } = generateCoordinatesLayer(
    { x, y }, 
    $sectionContext, 
    $coordinateTransformationContext,
    index
  )

  // Generate other prop objects
  let radiusObject = generatePropObject(radius, index)
  let fillObject = generatePropObject(fill, index)

  // Create transitionables
  let tr_xObject = createTransitionableLayer('x', xObject, transition)
  let tr_yObject = createTransitionable('y', yObject, transition)
  let tr_radiusObject = createTransitionable('radius', radiusObject, transition)
  let tr_fillObject = createTransitionable('fill', fillObject, transition)
  
  $: {
    if (initDone()) {
      let { xArray, yArray, length } = generateCoordinatesLayer(
        { x, y }, 
        $sectionContext, 
        $coordinateTransformationContext
      )

      setLength(length)

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

  {#each $tr_xArray as _, i}

    <circle 
      cx={$tr_xArray[i]} 
      cy={$tr_yArray[i]} 
      r={$tr_radiusArray[i]} 
      fill={$tr_fillArray[i]} 
    />

  {/each}

{/if}