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
  import { markScreenGeometryFuncs } from './screenGeometryFuncs.js'
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
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let interpolate = false
  export let _asPath = true

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
  let createCoordSysGeometry = markCoordSysGeometryFuncs[type]
  let createScreenGeometry = markScreenGeometryFuncs[type]

  $: {
    if (initDone()) {
      createCoordSysGeometry = markCoordSysGeometryFuncs[type]
      createScreenGeometry = markScreenGeometryFuncs[type]
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Create screenGeometry
  let coordSysGeometry = createCoordSysGeometry(
    positioningAesthetics, 
    $sectionContext, 
    $coordinateTransformationContext,
    interpolate
  )
  let pixelGeometry
  let screenGeometry

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', getScreenGeometry(), transition)
  let tr_radius = createTransitionable('radius', aesthetics.radius, transition)
  let tr_fill = createTransitionable('fill', aesthetics.fill, transition)
  let tr_opacity = createTransitionable('opacity', aesthetics.opacity, transition)

  // Handle zooming
  $: {
    if ($zoomContext) {
      tr_screenGeometry.set(getScreenGeometry())
    }
  }

  // Handle screenGeometry transitions
  $: {
    if (initDone()) {
      coordSysGeometry = createCoordSysGeometry(
        positioningAesthetics, 
        $sectionContext, 
        $coordinateTransformationContext,
        interpolate
      )

      if (type === 'Point') {
        tr_radius.set(aesthetics.radius)
      }
      
      tr_screenGeometry.set(getScreenGeometry())

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fill.set(fill) }

  let previousTransition

  // Update transitionables when transition settings change
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_radius = createTransitionable('radius', $tr_radius, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)
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
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function getScreenGeometry () {
    if ($zoomContext) {
      pixelGeometry = transformGeometry(coordSysGeometry, $zoomContext)
    } else {
      pixelGeometry = coordSysGeometry
    }

    if (_asPath) {
      screenGeometry = createScreenGeometry(pixelGeometry, { radius: aesthetics.radius })
    } else {
      screenGeometry = pixelGeometry
    }

    return screenGeometry
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

  {#if type !== 'Point' || _asPath}

    <path
      class={type.toLowerCase()}
      d={generatePath($tr_screenGeometry)}
      fill={$tr_fill}
      style={`opacity: ${$tr_opacity}`}
    />

  {/if}

  {#if type === 'Point' && !_asPath}

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