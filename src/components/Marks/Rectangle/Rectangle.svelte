<script context="module">
  let idCounter = 0
  function getId () {
    return 'rt' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  import { transformGeometry } from 'geometryUtils'
  import generateScreenGeometry from './generateScreenGeometry.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'

  let markId = getId()

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
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Create screenGeometry
  let unzoomedSceenGeometry = generateScreenGeometry(
    { x1, x2, y1, y2 },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate
  )
  let screenGeometry

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', getZoomedScreenGeometry(), transition)
  let tr_fill = createTransitionable('fill', fill, transition)
  let tr_opacity = createTransitionable('opacity', opacity, transition)

  // Handle zooming
  $: {
    if ($zoomContext) {
      tr_screenGeometry.set(getZoomedScreenGeometry())
    }
  }

  // Handle screenGeometry transitions
  $: {
    if (initDone()) {
      unzoomedSceenGeometry = generateScreenGeometry(
        { x1, x2, y1, y2 },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate
      )

      tr_screenGeometry.set(getZoomedScreenGeometry())

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fill.set(fill) }
  $: { if (initDone()) tr_opacity.set(opacity) }

  let previousTransition

  // Update transitionables
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
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
    removeLayerFromSpatialIndexIfNecessary()
  })

  // Helpers
  function getZoomedScreenGeometry () {
    if ($zoomContext) {
      screenGeometry = transformGeometry(unzoomedSceenGeometry, $zoomContext)
    } else {
      screenGeometry = unzoomedSceenGeometry
    }

    return screenGeometry
  }

  function updateInteractionManagerIfNecessary () {
    removeLayerFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadMark('Rectangle', createMarkData())

      if (onClick) $interactionManagerContext.addMarkInteraction('click', markId, onClick)
      if (onMouseover) $interactionManagerContext.addMarkInteraction('mouseover', markId, onMouseover)
      if (onMouseout) $interactionManagerContext.addMarkInteraction('mouseout', markId, onMouseout)
    }
  }

  function removeLayerFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.markIsLoaded(markId)) {
      $interactionManagerContext.removeAllMarkInteractions(markId)
      $interactionManagerContext.removeMark(markId)
    }
  }

  function createMarkData () {
    return {
      attributes: { screenGeometry },
      markId
    }
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <path 
    class="rectangle"
    d={generatePath($tr_screenGeometry)} 
    fill={$tr_fill}
    style={`opacity: ${$tr_opacity}`}
  />

{/if}