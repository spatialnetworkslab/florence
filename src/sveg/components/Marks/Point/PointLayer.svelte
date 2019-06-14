<script context="module">
  let idCounter = -1
  function getId () {
    return 'ptl_' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  
  import { generateCoordinatesLayer } from './generateCoordinatesLayer.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'

  let layerId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined
  export let index = undefined
  export let onClick = undefined
  export let onHover = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()

  // Generate coordinate objects and index array
  let { xObject, yObject, indexArray } = generateCoordinatesLayer(
    { x, y }, 
    $sectionContext, 
    $coordinateTransformationContext,
    index
  )

  // Generate other prop objects
  let radiusObject = generatePropObject(radius, indexArray)
  let fillObject = generatePropObject(fill, indexArray)

  // Create transitionables
  let tr_xObject = createTransitionableLayer('x', xObject, transition)
  let tr_yObject = createTransitionableLayer('y', yObject, transition)
  let tr_radiusObject = createTransitionableLayer('radius', radiusObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)

  $: {
    if (initDone()) {
      let c = generateCoordinatesLayer(
        { x, y }, 
        $sectionContext, 
        $coordinateTransformationContext,
        index
      )
      indexArray = c.indexArray

      tr_xObject.set(c.xObject)
      tr_yObject.set(c.yObject)
    }
  }

  $: { if (initDone()) tr_radiusObject.set(generatePropObject(radius, indexArray)) }
  $: { if (initDone()) tr_fillObject.set(generatePropObject(fill, indexArray)) }

  let previousTransition

  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_xObject = createTransitionableLayer('x', $tr_xObject, transition)
      tr_yObject = createTransitionableLayer('y', $tr_yObject, transition)
      tr_radiusObject = createTransitionableLayer('radius', $tr_radiusObject, transition)
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })

  // Interactivity
  $: isInteractive = onClick !== undefined || onHover !== undefined

  onMount(() => {
    if (isInteractive) {
      $interactionManagerContext.loadLayer('Point', {
        geometries: { x: xObject, y: yObject, radius: radiusObject },
        layerId,
        indexArray
      })

      if (onClick) $interactionManagerContext.addInteraction('click', layerId, onClick)
      if (onHover) $interactionManagerContext.addInteraction('hover', layerId, onHover)
    }
  })
</script>

{#if $graphicContext.output() === 'svg'}

  {#each indexArray as index (index)}

    <circle
      cx={$tr_xObject[index]}
      cy={$tr_yObject[index]}
      r={$tr_radiusObject[index]}
      fill={$tr_fillObject[index]}
    />

  {/each}

{/if}