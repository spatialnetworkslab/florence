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
  import { layerRepresentAsPolygonFuncs } from './representAsPolygonFuncs.js'
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

  // Aesthetics: other
  export let radius = undefined
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
  export let _asPolygon = true

  // Validate aesthetics every time input changes
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

  // Create 'positioning' aesthetics object
  let positioningAesthetics = { x, y, x1, x2, y1, y2, geometry }
  $: {
    if (initDone()) {
      positioningAesthetics = { x, y, x1, x2, y1, y2, geometry }
    }
  }

  // Select appriopriate geometry conversion functions
  let createCoordSysGeometryObject = layerCoordSysGeometryFuncs[type]
  let representAsPolygonObject = layerRepresentAsPolygonFuncs[type]

  $: {
    if (initDone()) {
      createCoordSysGeometryObject = layerCoordSysGeometryFuncs[type]
      representAsPolygonObject = layerRepresentAsPolygonFuncs[type]
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Initiate geometry objects and index array
  let indexArray
  let coordSysGeometryObject
  let pixelGeometryObject
  let screenGeometryObject

  updateCoordSysGeometryObject()
  updatePixelGeometryObject()

  // Generate other prop objects
  let radiusObject = generatePropObject(aesthetics.radius, indexArray)
  let fillObject = generatePropObject(aesthetics.fill, indexArray)
  let opacityObject = generatePropObject(aesthetics.opacity, indexArray)

  // This one uses the radiusObject in some cases, so must be done after the prop objects
  updateScreenGeometryObject()

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', screenGeometryObject, transition)
  let tr_radiusObject = createTransitionableLayer('radius', radiusObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)
  let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition)

  // Handle coordSysGeometryObject changes
  $: {
    if (initDone()) {
      scheduleUpdateCoordSysGeometryObject(
        positioningAesthetics, 
        $sectionContext,
        $coordinateTransformationContext,
        index,
        interpolate
      )
    }
  }

  // Handle zooming changes
  $: {
    if (initDone()) {
      scheduleUpdatePixelGeometryObject($zoomContext)
    }
  }

  // Handle radius changes
  $: {
    if (initDone()) {
      if (!_asPolygon) {
        radiusObject = generatePropObject(aesthetics.radius, indexArray)
        tr_radiusObject.set(radiusObject)
      }

      if (_asPolygon) {
        scheduleUpdateScreenGeometryObject()
      }
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_fillObject.set(generatePropObject(aesthetics.fill, indexArray)) }
  $: { if (initDone()) tr_opacityObject.set(generatePropObject(aesthetics.opacity, indexArray)) }

  let previousTransition

  let coordSysGeometryObjectRecalculationNecessary = false
  let pixelGeometryObjectRecalculationNecessary = false
  let screenGeometryObjectRecalculationNecessary = false

  beforeUpdate(() => {
    // Update transitionables
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition)
      tr_radiusObject = createTransitionableLayer('radius', $tr_radiusObject, transition)
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
      tr_opacityObject = createTransitionableLayer('opacity', $tr_opacityObject, transition)
    }

    if (coordSysGeometryObjectRecalculationNecessary) updateCoordSysGeometryObject()

    if (pixelGeometryObjectRecalculationNecessary) updatePixelGeometryObject()

    if (screenGeometryObjectRecalculationNecessary) {
      updateScreenGeometryObject()
      tr_screenGeometryObject.set(screenGeometryObject)

      updateInteractionManagerIfNecessary()
    }

    coordSysGeometryObjectRecalculationNecessary = false
    pixelGeometryObjectRecalculationNecessary = false
    screenGeometryObjectRecalculationNecessary = false
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
  function scheduleUpdateCoordSysGeometryObject () {
    coordSysGeometryObjectRecalculationNecessary = true
    pixelGeometryObjectRecalculationNecessary = true
    screenGeometryObjectRecalculationNecessary = true
  }

  function updateCoordSysGeometryObject () {
    let _ = createCoordSysGeometryObject(
      positioningAesthetics, 
      $sectionContext,
      $coordinateTransformationContext,
      index,
      interpolate
    )

    indexArray = _.indexArray
    coordSysGeometryObject = _.coordSysGeometryObject
  }

  function scheduleUpdatePixelGeometryObject () {
    pixelGeometryObjectRecalculationNecessary = true
    screenGeometryObjectRecalculationNecessary = true
  }

  function updatePixelGeometryObject () {
    if ($zoomContext) {
      pixelGeometryObject = transformGeometries(coordSysGeometryObject, $zoomContext)
    } else {
      pixelGeometryObject = coordSysGeometryObject
    }
  }

  function scheduleUpdateScreenGeometryObject () {
    screenGeometryObjectRecalculationNecessary = true
  }

  function updateScreenGeometryObject () {
    if (_asPolygon) {
      screenGeometryObject = representAsPolygonObject(pixelGeometryObject, { radiusObject })
    } else {
      screenGeometryObject = pixelGeometryObject
    }
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
      type, layerId, indexArray, { pixelGeometryObject, screenGeometryObject }, { radiusObject }
    )
  }
</script>

{#if $graphicContext.output() === 'svg'}

  {#if type !== 'Point' || _asPolygon}

    {#each indexArray as $index ($index)}

      <path
        class={type.toLowerCase()}
        d={generatePath($tr_screenGeometryObject[$index])}
        fill={$tr_fillObject[$index]}
        style={`opacity: ${$tr_opacityObject[$index]}`}
      />

    {/each}

  {/if}

  {#if type === 'Point' && !_asPolygon}

    {#each indexArray as $index ($index)}

      <circle
        class="point"
        cx={$tr_screenGeometryObject[$index].coordinates[0]}
        cy={$tr_screenGeometryObject[$index].coordinates[1]}
        r={$tr_radiusObject[$index]}
        fill={$tr_fillObject[$index]}
        style={`opacity: ${$tr_opacityObject[$index]}`}
      />

    {/each}

  {/if}

{/if}