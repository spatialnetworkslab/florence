<script context="module">
  let idCounter = 0
  function getId () {
    return 'ptl' + idCounter++
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

  let layerId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined
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
    index
  )

  // Generate other prop objects
  let radiusObject = generatePropObject(radius, indexArray)
  let fillObject = generatePropObject(fill, indexArray)

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', screenGeometryObject, transition)
  let tr_radiusObject = createTransitionableLayer('radius', radiusObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)

  // Handle screenGeometryObject transitions
  $: {
    if (initDone()) {
      let _ = generateScreenGeometryObject(
        { x, y, geometry }, 
        $sectionContext,
        $coordinateTransformationContext,
        index
      )
      
      indexArray = _.indexArray
      screenGeometryObject = _.screenGeometryObject

      radiusObject = generatePropObject(radius, indexArray)

      tr_screenGeometryObject.set(screenGeometryObject)
      tr_radiusObject.set(radiusObject)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fillObject.set(generatePropObject(fill, indexArray)) }

  let previousTransition

  // Update transitionables
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition)
      tr_radiusObject = createTransitionableLayer('radius', $tr_radiusObject, transition)
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
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
      $interactionManagerContext.loadLayer('Point', createLayerData())

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
      layerAttributes: { screenGeometryObject, radiusObject },
      layerId,
      indexArray
    }
  }
</script>

{#if $graphicContext.output() === 'svg'}

  {#each indexArray as $index ($index)}

    <circle
      cx={$tr_screenGeometryObject[$index].coordinates[0]}
      cy={$tr_screenGeometryObject[$index].coordinates[1]}
      r={$tr_radiusObject[$index]}
      fill={$tr_fillObject[$index]}
    />

  {/each}

{/if}