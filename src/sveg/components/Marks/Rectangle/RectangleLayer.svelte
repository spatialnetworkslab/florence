<script context="module">
  let idCounter = 0
  function getId () {
    return 'rtl' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  
  import { generateCoordinatesLayer } from './generateCoordinatesLayer.js'
  import { generatePropObject } from '../utils/generatePropObject.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'

  let layerId = getId()

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
  export let index = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()

  // Generate coordinate object and index array
  let { coordinateObject, indexArray } = generateCoordinatesLayer(
    { x1, x2, y1, y2 },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate,
    index
  )

  // Generate other prop arrays
  let fillObject = generatePropObject(fill, indexArray)
  let opacityObject = generatePropObject(opacity, indexArray)

  // Create transitionables
  let tr_coordinateObject = createTransitionableLayer('coordinates', coordinateObject, transition, 'LineString')
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)
  let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition)

  // Handle coordinate/geometry prop transitions
  $: {
    if (initDone()) {
      let c = generateCoordinatesLayer(
        { x1, x2, y1, y2 },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate,
        index
      )

      coordinateObject = c.coordinateObject
      indexArray = c.indexArray

      tr_coordinateObject.set(c.coordinateObject)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other prop transitions
  $: { if (initDone()) tr_fillObject.set(generatePropObject(fill, indexArray)) }
  $: { if (initDone()) tr_opacityObject.set(generatePropObject(opacity, indexArray)) }

  let previousTransition

  // Update transition parameters
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_coordinateObject = createTransitionableLayer('coordinates', $tr_coordinateObject, transition, 'LineString')
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
      tr_opacityObject = createTransitionableLayer('opacity', $tr_opacityObject, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })

  // Interactivity
  $: isInteractive = onClick !== undefined || onMouseover !== undefined || onMouseout !== undefined

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  onDestroy(() => {
    removeLayerFromSpatialIndexIfNecessary()
  })

  // Helpers
  function updateInteractionManagerIfNecessary () {
    removeLayerFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadLayer('Rectangle', createLayerData())

      if (onClick) $interactionManagerContext.addLayerInteraction('click', layerId, onClick)
      if (onMouseover) $interactionManagerContext.addLayerInteraction('mouseover', layerId, onMouseover)
      if (onMouseout) $interactionManagerContext.addLayerInteraction('mouseout', layerId, onMouseout)
    }
  }

  function removeLayerFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.layerIsLoaded(layerId)) {
      $interactionManagerContext.removeAllLayerInteractions(layerId)
      $interactionManagerContext.removeLayer(layerId)
    }
  }

  function createLayerData () {
    return {
      geometries: coordinateObject,
      layerId,
      indexArray
    }
  }
</script>

{#if $graphicContext.output() === 'svg'}

  {#each indexArray as index (index)}

    <path 
      d={generatePath($tr_coordinateObject[index])} 
      fill={$tr_fillObject[index]}
      style={`opacity: ${$tr_opacityObject[index]}`}
    />

  {/each}

{/if}