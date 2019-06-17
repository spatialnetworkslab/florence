<script context="module">
  let idCounter = -1
  function getId () {
    return 'pt' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  
  import { generateCoordinates } from './generateCoordinates.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'

  let markId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()

  // Convert coordinates
  let coordinates = generateCoordinates({ x, y }, $sectionContext, $coordinateTransformationContext)

  // Create transitionables
  let tr_x = createTransitionable('x', coordinates[0], transition)
  let tr_y = createTransitionable('y', coordinates[1], transition)
  let tr_radius = createTransitionable('radius', radius, transition)
  let tr_fill = createTransitionable('fill', fill, transition)

  // Handle coordinate/geometry prop transitions
  $: {
    if (initDone()) {
      coordinates = generateCoordinates({ x, y }, $sectionContext, $coordinateTransformationContext)
      tr_x.set(coordinates[0])
      tr_y.set(coordinates[1])
      tr_radius.set(radius)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other prop transitions
  $: { if (initDone()) tr_fill.set(fill) }

  let previousTransition

  // Update transition parameters
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_x = createTransitionable('x', $tr_x, transition)
      tr_y = createTransitionable('y', $tr_y, transition)
      tr_radius = createTransitionable('radius', $tr_radius, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
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
  function updateInteractionManagerIfNecessary () {
    removeMarkFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadMark('Point', createMarkData())

      if (onClick) $interactionManagerContext.addMarkInteraction('click', markId)
      if (onMouseover) $interactionManagerContext.addMarkInteraction('mouseover', markId)
      if (onMouseout) $interactionManagerContext.addMarkInteraction('mouseout', markId)
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.markIsLoaded(markId)) {
      $interactionManagerContext.removeAllMarkInteractions(markId)
      $interactionManagerContext.removeMark(markId)
    }
  }

  function createMarkData () {
    return {
      geometry: { x: coordinates[0], y: coordinates[1], radius },
      markId,
      callbacks: [onClick, onMouseover]
    }
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <circle 
    cx={$tr_x} 
    cy={$tr_y} 
    r={$tr_radius} 
    fill={$tr_fill} 
  />

{/if}