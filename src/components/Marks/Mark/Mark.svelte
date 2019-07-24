<script context="module">
  let idCounter = 0
  function getId () {
    return 'mark' + idCounter++
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
  import { markCoordSysGeometryFuncs } from './coordSysGeometryFuncs.js'
  import { markRepresentAsPolygonFuncs } from './representAsPolygonFuncs.js'
  import { createDataNecessaryForIndexingMark } from './createDataNecessaryForIndexing.js'
  import { transformGeometry } from 'geometryUtils'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'

  import generatePath from '../utils/generatePath.js'

  let markId = getId()

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
  export let strokeWidth = undefined
  export let stroke = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let interpolate = false
  export let _asPolygon = true

  // Validate aesthetics every time input changes
  let aesthetics = validateAesthetics(
    type,
    { 
      x, y, x1, x2, y1, y2, geometry, 
      radius, fill, strokeWidth, stroke, opacity
    }
  )
  $: {
    if (initDone()) {
      aesthetics = validateAesthetics(
        type,
        { 
          x, y, x1, x2, y1, y2, geometry, 
          radius, fill, strokeWidth, stroke, opacity 
        }
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
  let createCoordSysGeometry = markCoordSysGeometryFuncs[type]
  let representAsPolygon = markRepresentAsPolygonFuncs[type]

  $: {
    if (initDone()) {
      createCoordSysGeometry = markCoordSysGeometryFuncs[type]
      representAsPolygon = markRepresentAsPolygonFuncs[type]
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Initiate geometries
  let coordSysGeometry
  let pixelGeometry
  let screenGeometry

  updateCoordSysGeometry()
  updatePixelGeometry()
  updateScreenGeometry()

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', screenGeometry, transition)
  let tr_radius = createTransitionable('radius', aesthetics.radius, transition)
  let tr_fill = createTransitionable('fill', aesthetics.fill, transition)
  let tr_opacity = createTransitionable('opacity', aesthetics.opacity, transition)

  // Handle coordSysGeometry changes
  $: {
    if (initDone()) {
      scheduleUpdateCoordSysGeometry(
        positioningAesthetics, 
        $sectionContext, 
        $coordinateTransformationContext,
        interpolate
      )
    }
  }

  // Handle zooming changes
  $: {
    if (initDone()) {
      scheduleUpdatePixelGeometry($zoomContext)
    }
  }

  // Handle radius changes
  $: {
    if (initDone()) {
      if (!_asPolygon) {
        tr_radius.set(aesthetics.radius)
      }

      if (_asPolygon) {
        scheduleUpdateScreenGeometry()
      }
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_fill.set(aesthetics.fill) }
  $: { if (initDone()) tr_opacity.set(aesthetics.opacity) }

  let previousTransition

  let coordSysGeometryRecalculationNecessary = false
  let pixelGeometryRecalculationNecessary = false
  let screenGeometryRecalculationNecessary = false

  // Update transitionables when transition settings change
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_radius = createTransitionable('radius', $tr_radius, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)
    }

     if (coordSysGeometryRecalculationNecessary) updateCoordSysGeometry()

     if (pixelGeometryRecalculationNecessary) updatePixelGeometry()

     if (screenGeometryRecalculationNecessary) {
       updateScreenGeometry()
       tr_screenGeometry.set(screenGeometry)
       
       updateInteractionManagerIfNecessary()
     }

     coordSysGeometryRecalculationNecessary = false
     pixelGeometryRecalculationNecessary = false
     screenGeometryRecalculationNecessary = false
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
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function scheduleUpdateCoordSysGeometry () {
    coordSysGeometryRecalculationNecessary = true
    pixelGeometryRecalculationNecessary = true
    screenGeometryRecalculationNecessary = true
  }

  function updateCoordSysGeometry () {
    coordSysGeometry = createCoordSysGeometry(
      positioningAesthetics, 
      $sectionContext, 
      $coordinateTransformationContext,
      interpolate
    )
  }

  function scheduleUpdatePixelGeometry () {
    pixelGeometryRecalculationNecessary = true
    screenGeometryRecalculationNecessary = true
  }

  function updatePixelGeometry () {
    if ($zoomContext) {
      pixelGeometry = transformGeometry(coordSysGeometry, $zoomContext)
    } else {
      pixelGeometry = coordSysGeometry
    }
  }

  function scheduleUpdateScreenGeometry () {
    screenGeometryRecalculationNecessary = true
  }

  function updateScreenGeometry () {
    if (_asPolygon) {
      screenGeometry = representAsPolygon(pixelGeometry, { radius: aesthetics.radius })
    } else {
      screenGeometry = pixelGeometry
    }
  }

  function updateInteractionManagerIfNecessary () {
    removeMarkFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadMark(type, createDataNecessaryForIndexing())

      if (onClick) $interactionManagerContext.addMarkInteraction('click', markId, onClick)
      if (onMouseover) $interactionManagerContext.addMarkInteraction('mouseover', markId, onMouseover)
      if (onMouseout) $interactionManagerContext.addMarkInteraction('mouseout', markId, onMouseout)
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.markIsLoaded(markId)) {
      $interactionManagerContext.removeAllMarkInteractions(markId)
      $interactionManagerContext.removeMark(markId)
    }
  }

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingMark(
      type, markId, { screenGeometry, pixelGeometry }, { radius: aesthetics.radius }
    )
  }
</script>

{#if $graphicContext.output() === 'svg'}

  {#if type !== 'Point' || _asPolygon}

    <path
      class={type.toLowerCase()}
      d={generatePath($tr_screenGeometry)}
      fill={$tr_fill}
      style={`opacity: ${$tr_opacity}`}
    />

  {/if}

  {#if type === 'Point' && !_asPolygon}

    <circle 
      class="point"
      cx={$tr_screenGeometry.coordinates[0]}
      cy={$tr_screenGeometry.coordinates[1]}
      r={$tr_radius}
      fill={$tr_fill}
      style={`opacity: ${$tr_opacity}`}
    />

  {/if}

{/if}