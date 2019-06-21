<script context="module">
  let idCounter = 0
  function getId () {
    return 'pll' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  
  import generateScreenGeometryObject from './generateScreenGeometryObject.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'
  import generatePath from '../utils/generatePath.js'

  let layerId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
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

  // Generate screenGeometryObject and index array
  let { screenGeometryObject, indexArray } = generateScreenGeometryObject(
    { x, y, geometry },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate,
    index
  )

  // Generate other prop arrays
  let fillObject = generatePropObject(fill, indexArray)
  let opacityObject = generatePropObject(opacity, indexArray)

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', screenGeometryObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)
  let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition)

  // Handle coordinate/geometry prop transitions
  $: {
    if (initDone()) {
      let _ = generateScreenGeometryObject(
        { x, y, geometry },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate,
        index
      )

      indexArray = _.indexArray
      screenGeometryObject = _.screenGeometryObject

      tr_screenGeometryObject.set(screenGeometryObject)

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

      tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition)
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
      $interactionManagerContext.loadLayer('Polygon', createLayerData())

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
      layerAttributes: { screenGeometryObject },
      layerId,
      indexArray
    }
  }
</script>

{#if $graphicContext.output() === 'svg'}

  {#each indexArray as $index ($index)}

    <path 
      d={generatePath($tr_screenGeometryObject[$index])} 
      fill={$tr_fillObject[$index]}
      style={`opacity: ${$tr_opacityObject[$index]}`}
    />

  {/each}

{/if}