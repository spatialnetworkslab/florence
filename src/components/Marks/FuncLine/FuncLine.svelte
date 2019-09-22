<script context="module">
  let idCounter = 0
  function getId () {
    return 'funcline' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'
  import detectIt from 'detect-it'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/Section/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'

  import createScreenGeometry from './createScreenGeometry.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'
  import { createDataNecessaryForIndexingMark } from '../Mark/createDataNecessaryForIndexing.js'

  let markId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Aesthetics: positioning
  export let func
  export let x = undefined

  // Aesthetics: other
  export let strokeWidth = 1
  export let stroke = 'black'
  export let opacity = 1

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let zoomIdentity = undefined
  export let blockReindexing = false

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  let screenGeometry = createScreenGeometry(
    { func, x }, 
    $sectionContext,
    $coordinateTransformationContext,
    ZoomContext.createZoomTransformation($zoomContext, zoomIdentity)
  )

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', screenGeometry, transition)
  let tr_stroke = createTransitionable('stroke', stroke, transition)
  let tr_strokeWidth = createTransitionable('strokeWidth', strokeWidth, transition)
  let tr_opacity = createTransitionable('opacity', opacity, transition)

  // Handle screenGeometry changes
  $: {
    if (initDone()) {
      screenGeometry = createScreenGeometry(
        { func, x },
        $sectionContext,
        $coordinateTransformationContext,
        ZoomContext.createZoomTransformation($zoomContext, zoomIdentity)
      )

      tr_screenGeometry.set(screenGeometry)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_stroke.set(stroke) }
  $: { if (initDone()) tr_strokeWidth.set(strokeWidth) }
  $: { if (initDone()) tr_opacity.set(opacity) }

  let previousTransition

  // Update transitionables when transition settings change
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_stroke = createTransitionable('stroke', $tr_stroke, transition)
      tr_strokeWidth = createTransitionable('strokeWidth', $tr_strokeWidth, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })

  // Interactivity
  $: isInteractiveMouse = detectIt.hasMouse && (onClick !== undefined || 
    onMousedown !== undefined || onMouseup !== undefined ||
    onMouseover !== undefined || onMouseout !== undefined)

  $: isInteractiveTouch = detectIt.hasTouch // TODO

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  onDestroy(() => {
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function updateInteractionManagerIfNecessary () {
    if (initPhase || !blockReindexing) {
      removeMarkFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManagerContext.mouse().marks()

        markInterface.loadMark('Line', createDataNecessaryForIndexing())

        if (onClick) markInterface.addMarkInteraction('click', markId, onClick)
        if (onMousedown) markInterface.addMarkInteraction('mousedown', markId, onMousedown)
        if (onMouseup) markInterface.addMarkInteraction('mouseoup', markId, onMouseup)
        if (onMouseover) markInterface.addMarkInteraction('mouseover', markId, onMouseover)
        if (onMouseout) markInterface.addMarkInteraction('mouseout', markId, onMouseout)
      }

      if (isInteractiveTouch) {
        // TODO
      }
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    const markInterface = $interactionManagerContext.mouse().marks()

    if (markInterface.markIsLoaded(markId)) {
      markInterface.removeAllMarkInteractions(markId)
      markInterface.removeMark(markId)
    }
  }

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingMark(
      'Line', markId, { pixelGeometry: screenGeometry }, { strokeWidth }
    )
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <path
    class="line"
    d={generatePath($tr_screenGeometry)}
    fill="none"
    stroke-width={$tr_strokeWidth}
    stroke={$tr_stroke}
    opacity={$tr_opacity}
  />

{/if}
