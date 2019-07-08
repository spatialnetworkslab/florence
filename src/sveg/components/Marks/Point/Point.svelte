<script context="module">
  let idCounter = 0
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
  
  import generateScreenGeometry from './generateScreenGeometry.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'

  let markId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
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

  // Create screenGeometry
  let screenGeometry = generateScreenGeometry(
    { x, y, geometry }, $sectionContext, $coordinateTransformationContext
  )

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', screenGeometry, transition)
  let tr_radius = createTransitionable('radius', radius, transition)
  let tr_fill = createTransitionable('fill', fill, transition)

  // Handle screenGeometry transitions
  $: {
    if (initDone()) {
      screenGeometry = generateScreenGeometry(
        { x, y, geometry }, $sectionContext, $coordinateTransformationContext
      )

      tr_screenGeometry.set(screenGeometry)
      tr_radius.set(radius)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fill.set(fill) }

  let previousTransition

  // Update transitionables
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
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

  function createMarkData () {
    return {
      attributes: { screenGeometry, radius },
      markId
    }
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <circle 
    cx={$tr_screenGeometry.coordinates[0]} 
    cy={$tr_screenGeometry.coordinates[1]} 
    r={$tr_radius} 
    fill={$tr_fill} 
  />

{/if}