<script context="module">
  let idCounter = 0
  function getId () {
    return 'layer' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  import validateAesthetics from './validateAesthetics.js'
  import { transformGeometries } from 'geometryUtils'
  import { layerCoordSysGeometryFuncs } from './coordSysGeometryFuncs.js'
  import { layerScreenGeometryFuncs } from './screenGeometryFuncs.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'
  import { createDataNecessaryForIndexingLayer } from './createDataNecessaryForIndexing.js'
  import generatePath from '../utils/generatePath.js'

  let layerId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  export let type

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let geometry = undefined
  export let radius = undefined

  // Aesthetics: other
  export let fill = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let index = undefined
  export let interpolate = undefined

  // Validate aesthetics
  let aesthetics = validateAesthetics(
    type,
    { x, y, x1, x2, y1, y2, geometry, radius, fill, opacity }
  )

  $: {
    if (initDone()) {
      aesthetics = validateAesthetics(
        type,
        { x, y, x1, x2, y1, y2, geometry, radius, fill, opacity }
      )
    }
  }

  // Select appriopriate geometry conversion functions
  let createCoordSysGeometryObject = layerCoordSysGeometryFuncs[type]
  let createScreenGeometryObject = layerScreenGeometryFuncs[type]

  $: {
    if (initDone()) {
      createCoordSysGeometryObject = layerCoordSysGeometryFuncs[type]
      createScreenGeometryObject = layerScreenGeometryFuncs[type]
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Generate screenGeometryObject and index array
  let _ = createCoordSysGeometryObject(
    aesthetics, 
    $sectionContext,
    $coordinateTransformationContext,
    index,
    interpolate
  )

  let indexArray = _.indexArray
  let coordSysGeometryObject = _.coordSysGeometryObject
  let pixelGeometryObject
  let screenGeometryObject

  // Generate other prop objects
  let radiusObject = generatePropObject(radius, indexArray)
  let fillObject = generatePropObject(fill, indexArray)
  let opacityObject = generatePropObject(opacity, indexArray)

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', getScreenGeometryObject(), transition)
  let tr_radiusObject = createTransitionableLayer('radius', radiusObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)
  let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition)

  // Handle zooming
  $: {
    if ($zoomContext) {
      tr_screenGeometryObject.set(getScreenGeometryObject())
    }
  }

  // Handle screenGeometryObject transitions
  $: {
    if (initDone()) {
      _ = createCoordSysGeometryObject(
        aesthetics, 
        $sectionContext,
        $coordinateTransformationContext,
        index,
        interpolate
      )
      
      indexArray = _.indexArray
      coordSysGeometryObject = _.coordSysGeometryObject

      radiusObject = generatePropObject(radius, indexArray)
      tr_radiusObject.set(radiusObject)

      tr_screenGeometryObject.set(getScreenGeometryObject())

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
  function getScreenGeometryObject () {
    if ($zoomContext) {
      pixelGeometryObject = transformGeometries(coordSysGeometryObject, $zoomContext)
    } else {
      pixelGeometryObject = coordSysGeometryObject
    }

    screenGeometryObject = createScreenGeometryObject(pixelGeometryObject, { radiusObject })

    return screenGeometryObject
  }

  function updateInteractionManagerIfNecessary () {
    removeLayerFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadLayer(type, createDataNecessaryForIndexing())

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

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingLayer(
      type, layerId, index, { pixelGeometryObject, screenGeometryObject }, { radiusObject }
    )
  }
</script>

{#if $graphicContext.output() === 'svg'}

  {#each indexArray as $index ($index)}

    <path
      class="point"
      d={generatePath($tr_screenGeometryObject[$index])}
      fill={$tr_fillObject[$index]}
      style={`opacity: ${$tr_opacityObject[$index]}`}
    />

  {/each}

{/if}